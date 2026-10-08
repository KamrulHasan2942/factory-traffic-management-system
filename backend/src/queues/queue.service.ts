import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueueEntry } from './queue-entry.entity';

import {
  Direction,
  VehicleType,
} from '../traffic/domain/traffic.enums';

import { getVehiclePriority } from '../traffic/domain/traffic-rules';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntry)
    private readonly queueRepository: Repository<QueueEntry>,
  ) {}

  async addVehicle(data: {
    junctionId: string;
    direction: Direction;
    vehicleId: string;
    vehicleType: VehicleType;
    arrivedAt?: Date;
  }): Promise<QueueEntry> {
    const existing = await this.queueRepository.findOne({
      where: {
        junctionId: data.junctionId,
        vehicleId: data.vehicleId,
        active: true,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Vehicle ${data.vehicleId} is already in the queue`,
      );
    }

    const entry = this.queueRepository.create({
      junctionId: data.junctionId,
      direction: data.direction,
      vehicleId: data.vehicleId,
      vehicleType: data.vehicleType,
      priority: getVehiclePriority(data.vehicleType),
      arrivedAt: data.arrivedAt ?? new Date(),
      active: true,
    });

    return this.queueRepository.save(entry);
  }

  async clearVehicle(
    junctionId: string,
    vehicleId: string,
  ): Promise<QueueEntry> {
    const entry = await this.queueRepository.findOne({
      where: {
        junctionId,
        vehicleId,
        active: true,
      },
    });

    if (!entry) {
      throw new NotFoundException(
        `Vehicle ${vehicleId} is not in the active queue`,
      );
    }

    entry.active = false;

    return this.queueRepository.save(entry);
  }

  async getJunctionQueue(junctionId: string) {
    const entries = await this.queueRepository.find({
      where: {
        junctionId,
        active: true,
      },
      order: {
        priority: 'DESC',
        arrivedAt: 'ASC',
      },
    });

    return this.buildQueueSummary(entries);
  }

  async getDirectionQueue(
    junctionId: string,
    direction: Direction,
  ) {
    const entries = await this.queueRepository.find({
      where: {
        junctionId,
        direction,
        active: true,
      },
      order: {
        priority: 'DESC',
        arrivedAt: 'ASC',
      },
    });

    return {
      junctionId,
      direction,
      count: entries.length,
      vehicles: entries.map((entry) =>
        this.toQueueVehicle(entry),
      ),
    };
  }

  async getAllQueues(junctionId: string) {
    const entries = await this.queueRepository.find({
      where: {
        junctionId,
        active: true,
      },
      order: {
        arrivedAt: 'ASC',
      },
    });

    return {
      junctionId,
      NORTH: this.getDirectionEntries(
        entries,
        Direction.NORTH,
      ),
      SOUTH: this.getDirectionEntries(
        entries,
        Direction.SOUTH,
      ),
      EAST: this.getDirectionEntries(
        entries,
        Direction.EAST,
      ),
      WEST: this.getDirectionEntries(
        entries,
        Direction.WEST,
      ),
    };
  }

  async getHighestPriorityVehicle(
    junctionId: string,
  ): Promise<QueueEntry | null> {
    const entries = await this.queueRepository.find({
      where: {
        junctionId,
        active: true,
      },
      order: {
        priority: 'DESC',
        arrivedAt: 'ASC',
      },
    });

    return entries.length > 0 ? entries[0] : null;
  }

  private getDirectionEntries(
    entries: QueueEntry[],
    direction: Direction,
  ) {
    const directionEntries = entries
      .filter((entry) => entry.direction === direction)
      .sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }

        return (
          a.arrivedAt.getTime() -
          b.arrivedAt.getTime()
        );
      });

    return {
      count: directionEntries.length,
      vehicles: directionEntries.map((entry) =>
        this.toQueueVehicle(entry),
      ),
    };
  }

  private buildQueueSummary(entries: QueueEntry[]) {
    return {
      totalVehicles: entries.length,

      byDirection: {
        NORTH: this.countDirection(
          entries,
          Direction.NORTH,
        ),
        SOUTH: this.countDirection(
          entries,
          Direction.SOUTH,
        ),
        EAST: this.countDirection(
          entries,
          Direction.EAST,
        ),
        WEST: this.countDirection(
          entries,
          Direction.WEST,
        ),
      },

      vehicles: entries.map((entry) =>
        this.toQueueVehicle(entry),
      ),
    };
  }

  private countDirection(
    entries: QueueEntry[],
    direction: Direction,
  ): number {
    return entries.filter(
      (entry) => entry.direction === direction,
    ).length;
  }

  private toQueueVehicle(entry: QueueEntry) {
    const waitingTimeSeconds = Math.max(
      0,
      Math.floor(
        (Date.now() - entry.arrivedAt.getTime()) /
          1000,
      ),
    );

    return {
      id: entry.id,
      vehicleId: entry.vehicleId,
      vehicleType: entry.vehicleType,
      priority: entry.priority,
      direction: entry.direction,
      arrivedAt: entry.arrivedAt,
      waitingTimeSeconds,
    };
  }
}