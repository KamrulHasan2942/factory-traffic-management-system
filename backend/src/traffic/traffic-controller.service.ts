import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Junction } from '../junctions/junction.entity';
import { QueueService } from '../queues/queue.service';

import {
  Phase,
  SignalState,
  TrafficMode,
  VehicleType,
} from './domain/traffic.enums';

import { getPhase } from './domain/traffic-rules';

import { TrafficStateMachine } from './domain/traffic-state-machine';

import {
  TrafficCommand,
  TrafficCommandDto,
} from './dto/traffic-command.dto';

import {
  ControllerEventDto,
  ControllerEventType,
} from './dto/controller-event.dto';

import {
  ControllerCommand,
  ControllerCommandStatus,
} from './controller-command.entity';

@Injectable()
export class TrafficControllerService {
  private readonly stateMachine = new TrafficStateMachine();

  constructor(
    @InjectRepository(Junction)
    private readonly junctionRepository: Repository<Junction>,

    @InjectRepository(ControllerCommand)
    private readonly commandRepository: Repository<ControllerCommand>,

    private readonly queueService: QueueService,
  ) {}

  /*
   * AUTOMATIC TRAFFIC EVALUATION
   */
  async evaluate(junctionId: string) {
    const junction = await this.junctionRepository.findOne({
      where: {
        junctionId,
      },
    });

    if (!junction) {
      throw new NotFoundException(
        `Junction ${junctionId} not found`,
      );
    }

    if (!junction.isActive) {
      return {
        junctionId,
        action: 'NO_ACTION',
        reason: 'JUNCTION_INACTIVE',
      };
    }

    if (junction.mode !== TrafficMode.AUTOMATIC) {
      return {
        junctionId,
        action: 'NO_ACTION',
        reason: `JUNCTION_MODE_${junction.mode}`,
        currentPhase: junction.currentPhase,
      };
    }

    const queue =
      await this.queueService.getJunctionQueue(
        junctionId,
      );

    if (queue.totalVehicles === 0) {
      return {
        junctionId,
        action: 'NO_ACTION',
        reason: 'NO_VEHICLES_WAITING',
        currentPhase: junction.currentPhase,
      };
    }

    const candidates = queue.vehicles.map(
      (vehicle) => ({
        ...vehicle,
        requestedPhase: getPhase(
          vehicle.direction,
        ),
      }),
    );

    const conflictingCandidates =
      candidates.filter(
        (vehicle) =>
          vehicle.requestedPhase !==
          junction.currentPhase,
      );

    if (conflictingCandidates.length === 0) {
      const currentVehicle =
        candidates[0];

      return {
        junctionId,
        action: 'KEEP_CURRENT_PHASE',
        currentPhase:
          junction.currentPhase,
        requestedPhase:
          currentVehicle.requestedPhase,
        vehicleId:
          currentVehicle.vehicleId,
        vehicleType:
          currentVehicle.vehicleType,
        priority:
          currentVehicle.priority,
        waitingTimeSeconds:
          currentVehicle.waitingTimeSeconds,
        reason:
          'REQUESTED_PHASE_ALREADY_ACTIVE',
      };
    }

    const selectedVehicle =
      this.selectBestCandidate(
        conflictingCandidates,
      );

    const requestedPhase =
      selectedVehicle.requestedPhase;

    const decision =
      this.calculateDecision(
        junction,
        requestedPhase,
        selectedVehicle.vehicleType,
        selectedVehicle.waitingTimeSeconds,
      );

    if (!decision.shouldSwitch) {
      return {
        junctionId,
        action: 'KEEP_CURRENT_PHASE',
        currentPhase:
          junction.currentPhase,
        requestedPhase,
        vehicleId:
          selectedVehicle.vehicleId,
        vehicleType:
          selectedVehicle.vehicleType,
        priority:
          selectedVehicle.priority,
        waitingTimeSeconds:
          selectedVehicle.waitingTimeSeconds,
        reason: decision.reason,
      };
    }

    const transitions =
      this.stateMachine.getSafeTransition(
        junction.currentPhase,
        requestedPhase,
      );

    const previousPhase =
      junction.currentPhase;

    /*
     * Create controller command.
     *
     * IMPORTANT:
     * currentPhase is NOT changed here.
     *
     * Only desired state is changed.
     */
    const command =
      await this.createControllerCommand(
        junction,
        requestedPhase,
      );

    return {
      junctionId,
      action:
        'PHASE_CHANGE_REQUESTED',

      commandId:
        command.commandId,

      commandStatus:
        command.status,

      previousPhase,

      desiredPhase:
        requestedPhase,

      actualState: {
        phase:
          junction.currentPhase,
        state:
          junction.actualControllerState,
      },

      desiredState: {
        phase:
          junction.desiredPhase,
        state:
          junction.desiredSignalState,
      },

      vehicleId:
        selectedVehicle.vehicleId,

      vehicleType:
        selectedVehicle.vehicleType,

      priority:
        selectedVehicle.priority,

      waitingTimeSeconds:
        selectedVehicle.waitingTimeSeconds,

      transitions,

      reason:
        decision.reason,
    };
  }

  /*
   * MANUAL COMMAND
   */
  async executeCommand(
    junctionId: string,
    dto: TrafficCommandDto,
  ) {
    const junction =
      await this.junctionRepository.findOne({
        where: {
          junctionId,
        },
      });

    if (!junction) {
      throw new NotFoundException(
        `Junction ${junctionId} not found`,
      );
    }

    if (!junction.isActive) {
      throw new BadRequestException(
        'Cannot execute command on inactive junction',
      );
    }

    /*
     * RETURN TO AUTOMATIC
     */
    if (
      dto.command ===
      TrafficCommand.SET_AUTOMATIC
    ) {
      junction.mode =
        TrafficMode.AUTOMATIC;

      await this.junctionRepository.save(
        junction,
      );

      return {
        junctionId,
        action:
          'MODE_CHANGED',

        mode:
          TrafficMode.AUTOMATIC,

        currentPhase:
          junction.currentPhase,

        desiredState: {
          phase:
            junction.desiredPhase,
          state:
            junction.desiredSignalState,
        },

        actualState: {
          phase:
            junction.currentPhase,
          state:
            junction.actualControllerState,
        },

        reason:
          dto.reason ??
          'Manual control ended',
      };
    }

    /*
     * MANUAL SET_PHASE
     */
    if (
      dto.command ===
      TrafficCommand.SET_PHASE
    ) {
      if (!dto.targetPhase) {
        throw new BadRequestException(
          'targetPhase is required for SET_PHASE command',
        );
      }

      junction.mode =
        TrafficMode.MANUAL;

      const previousPhase =
        junction.currentPhase;

      /*
       * Already active.
       */
      if (
        previousPhase ===
        dto.targetPhase
      ) {
        await this.junctionRepository.save(
          junction,
        );

        return {
          junctionId,
          action:
            'NO_ACTION',

          mode:
            TrafficMode.MANUAL,

          currentPhase:
            junction.currentPhase,

          desiredState: {
            phase:
              junction.desiredPhase,
            state:
              junction.desiredSignalState,
          },

          actualState: {
            phase:
              junction.currentPhase,
            state:
              junction.actualControllerState,
          },

          targetPhase:
            dto.targetPhase,

          reason:
            'TARGET_PHASE_ALREADY_ACTIVE',
        };
      }

      const transitions =
        this.stateMachine.getSafeTransition(
          previousPhase,
          dto.targetPhase,
        );

      /*
       * Create PENDING controller command.
       *
       * Actual phase does not change yet.
       */
      const command =
        await this.createControllerCommand(
          junction,
          dto.targetPhase,
        );

      return {
        junctionId,

        action:
          'MANUAL_PHASE_CHANGE_REQUESTED',

        commandId:
          command.commandId,

        commandStatus:
          command.status,

        mode:
          TrafficMode.MANUAL,

        previousPhase,

        desiredPhase:
          dto.targetPhase,

        desiredState: {
          phase:
            junction.desiredPhase,
          state:
            junction.desiredSignalState,
        },

        actualState: {
          phase:
            junction.currentPhase,
          state:
            junction.actualControllerState,
        },

        transitions,

        reason:
          dto.reason ??
          'Manual operator command',
      };
    }

    throw new BadRequestException(
      `Unsupported command: ${dto.command}`,
    );
  }

  /*
   * CONTROLLER ACK / FAILURE EVENT
   */
  async processControllerEvent(
    dto: ControllerEventDto,
  ) {
    const command =
      await this.commandRepository.findOne({
        where: {
          commandId:
            dto.commandId,
        },
      });

    if (!command) {
      throw new NotFoundException(
        `Controller command ${dto.commandId} not found`,
      );
    }

    const junction =
      await this.junctionRepository.findOne({
        where: {
          junctionId:
            dto.junctionId,
        },
      });

    if (!junction) {
      throw new NotFoundException(
        `Junction ${dto.junctionId} not found`,
      );
    }

    /*
     * Prevent duplicate ACK/FAILED processing.
     */
    if (
      command.status !==
      ControllerCommandStatus.PENDING
    ) {
      return {
        commandId:
          command.commandId,

        junctionId:
          command.junctionId,

        status:
          command.status,

        message:
          'Controller command has already been finalized',
      };
    }

    /*
     * ACKNOWLEDGED
     */
    if (
      dto.eventType ===
      ControllerEventType.ACK
    ) {
      command.status =
        ControllerCommandStatus.ACKNOWLEDGED;

      command.acknowledgedAt =
        new Date();

      command.failureReason =
        null;

      /*
       * ACTUAL STATE changes only
       * after controller ACK.
       */
      junction.currentPhase =
        dto.actualPhase ??
        command.desiredPhase;

      junction.actualControllerState =
        dto.actualState ??
        SignalState.GREEN;

      junction.controllerStatus =
        'ONLINE';

      /*
       * Desired state remains the
       * requested command.
       */
      junction.desiredPhase =
        command.desiredPhase;

      junction.desiredSignalState =
        command.desiredState;

      /*
       * Update logical signal state
       * after physical confirmation.
       */
      this.setSignalStateForPhase(
        junction,
        junction.currentPhase,
      );

      await this.commandRepository.save(
        command,
      );

      await this.junctionRepository.save(
        junction,
      );

      return {
        commandId:
          command.commandId,

        status:
          command.status,

        junctionId:
          command.junctionId,

        desiredState: {
          phase:
            junction.desiredPhase,
          state:
            junction.desiredSignalState,
        },

        actualState: {
          phase:
            junction.currentPhase,
          state:
            junction.actualControllerState,
        },

        controllerStatus:
          junction.controllerStatus,

        acknowledgedAt:
          command.acknowledgedAt,
      };
    }

    /*
     * FAILED
     */
    if (
      dto.eventType ===
      ControllerEventType.FAILED
    ) {
      command.status =
        ControllerCommandStatus.FAILED;

      command.failureReason =
        dto.failureReason ??
        'Controller reported failure';

      /*
       * Do NOT change currentPhase.
       *
       * Physical controller did not
       * confirm the requested phase.
       */
      junction.controllerStatus =
        'OFFLINE';

      junction.actualControllerState =
        'UNKNOWN';

      await this.commandRepository.save(
        command,
      );

      await this.junctionRepository.save(
        junction,
      );

      return {
        commandId:
          command.commandId,

        status:
          command.status,

        junctionId:
          command.junctionId,

        desiredState: {
          phase:
            junction.desiredPhase,
          state:
            junction.desiredSignalState,
        },

        actualState: {
          phase:
            junction.currentPhase,
          state:
            junction.actualControllerState,
        },

        controllerStatus:
          junction.controllerStatus,

        reason:
          command.failureReason,
      };
    }

    throw new BadRequestException(
      'Unsupported controller event',
    );
  }

  /*
   * CONTROLLER STATUS
   */
  async getControllerStatus(
    junctionId: string,
  ) {
    const junction =
      await this.junctionRepository.findOne({
        where: {
          junctionId,
        },
      });

    if (!junction) {
      throw new NotFoundException(
        `Junction ${junctionId} not found`,
      );
    }

    const latestCommand =
      await this.commandRepository.findOne({
        where: {
          junctionId,
        },
        order: {
          id: 'DESC',
        },
      });

    return {
      junctionId,

      controllerStatus:
        junction.controllerStatus,

      desiredState: {
        phase:
          junction.desiredPhase,

        state:
          junction.desiredSignalState,
      },

      actualState: {
        phase:
          junction.currentPhase,

        state:
          junction.actualControllerState,
      },

      latestCommand:
        latestCommand
          ? {
              commandId:
                latestCommand.commandId,

              desiredPhase:
                latestCommand.desiredPhase,

              desiredState:
                latestCommand.desiredState,

              status:
                latestCommand.status,

              failureReason:
                latestCommand.failureReason,

              createdAt:
                latestCommand.createdAt,

              acknowledgedAt:
                latestCommand.acknowledgedAt,

              timeoutAt:
                latestCommand.timeoutAt,
            }
          : null,
    };
  }

  /*
   * TIMEOUT CHECK
   */
  async checkCommandTimeouts() {
    const timeoutMilliseconds =
      30 * 1000;

    const pendingCommands =
      await this.commandRepository.find({
        where: {
          status:
            ControllerCommandStatus.PENDING,
        },
      });

    const now =
      Date.now();

    const timedOut: string[] = [];

    for (
      const command of pendingCommands
    ) {
      const age =
        now -
        command.createdAt.getTime();

      if (
        age >=
        timeoutMilliseconds
      ) {
        command.status =
          ControllerCommandStatus.TIMEOUT;

        command.timeoutAt =
          new Date();

        command.failureReason =
          'Controller ACK timeout';

        await this.commandRepository.save(
          command,
        );

        const junction =
          await this.junctionRepository.findOne(
            {
              where: {
                junctionId:
                  command.junctionId,
              },
            },
          );

        if (junction) {
          /*
           * IMPORTANT:
           *
           * Do NOT change currentPhase.
           * Do NOT change actual state.
           */
          junction.controllerStatus =
            'TIMEOUT';

          await this.junctionRepository.save(
            junction,
          );
        }

        timedOut.push(
          command.commandId,
        );
      }
    }

    return {
      checked:
        pendingCommands.length,

      timedOut,
    };
  }

  /*
   * CREATE CONTROLLER COMMAND
   */
  private async createControllerCommand(
    junction: Junction,
    desiredPhase: Phase,
  ) {
    const commandId =
      `CMD-${Date.now()}-${Math.floor(
        Math.random() * 1000,
      )}`;

    /*
     * Save desired state only.
     *
     * Actual state remains unchanged
     * until ACK.
     */
    junction.desiredPhase =
      desiredPhase;

    junction.desiredSignalState =
      SignalState.GREEN;

    await this.junctionRepository.save(
      junction,
    );

    const command =
      this.commandRepository.create({
        commandId,

        junctionId:
          junction.junctionId,

        desiredPhase,

        desiredState:
          SignalState.GREEN,

        status:
          ControllerCommandStatus.PENDING,

        failureReason:
          null,

        acknowledgedAt:
          null,

        timeoutAt:
          null,
      });

    return this.commandRepository.save(
      command,
    );
  }

  /*
   * SELECT BEST VEHICLE
   */
  private selectBestCandidate(
    candidates: any[],
  ) {
    return [...candidates].sort(
      (a, b) => {
        /*
         * Higher priority first.
         */
        if (
          b.priority !==
          a.priority
        ) {
          return (
            b.priority -
            a.priority
          );
        }

        /*
         * Longer waiting time first.
         */
        if (
          b.waitingTimeSeconds !==
          a.waitingTimeSeconds
        ) {
          return (
            b.waitingTimeSeconds -
            a.waitingTimeSeconds
          );
        }

        /*
         * Earlier arrival first.
         */
        return (
          new Date(
            a.arrivedAt,
          ).getTime() -
          new Date(
            b.arrivedAt,
          ).getTime()
        );
      },
    )[0];
  }

  /*
   * AUTOMATIC DECISION
   */
  private calculateDecision(
    junction: Junction,
    requestedPhase: Phase,
    vehicleType: VehicleType,
    waitingTimeSeconds: number,
  ) {
    if (
      junction.currentPhase ===
      requestedPhase
    ) {
      return {
        shouldSwitch:
          false,

        reason:
          'REQUESTED_PHASE_ALREADY_ACTIVE',
      };
    }

    /*
     * Emergency vehicle gets
     * safe preemption.
     */
    if (
      vehicleType ===
      VehicleType.EMERGENCY
    ) {
      return {
        shouldSwitch:
          true,

        reason:
          'EMERGENCY_PREEMPTION',
      };
    }

    /*
     * Starvation protection.
     */
    if (
      waitingTimeSeconds >=
      60
    ) {
      return {
        shouldSwitch:
          true,

        reason:
          'STARVATION_PROTECTION',
      };
    }

    return {
      shouldSwitch:
        true,

      reason:
        'HIGHER_PRIORITY_REQUEST',
    };
  }

  /*
   * SET ACTUAL SIGNAL STATE
   *
   * This represents the physical state
   * after the controller confirms the
   * command.
   */
  private setSignalStateForPhase(
    junction: Junction,
    phase: Phase,
  ) {
    /*
     * Start with all RED.
     */
    junction.northSignal =
      SignalState.RED;

    junction.southSignal =
      SignalState.RED;

    junction.eastSignal =
      SignalState.RED;

    junction.westSignal =
      SignalState.RED;

    /*
     * NORTH/SOUTH GREEN
     */
    if (
      phase ===
      Phase.NORTH_SOUTH
    ) {
      junction.northSignal =
        SignalState.GREEN;

      junction.southSignal =
        SignalState.GREEN;
    }

    /*
     * EAST/WEST GREEN
     */
    if (
      phase ===
      Phase.EAST_WEST
    ) {
      junction.eastSignal =
        SignalState.GREEN;

      junction.westSignal =
        SignalState.GREEN;
    }
  }
}