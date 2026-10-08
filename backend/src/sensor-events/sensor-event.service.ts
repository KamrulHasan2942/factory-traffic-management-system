import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SensorEvent } from './sensor-event.entity';
import { CreateSensorEventDto } from './dto/sensor-event.dto';
import { Junction } from '../junctions/junction.entity';
import { SensorEventType } from '../traffic/domain/traffic.enums';
import { QueueService } from '../queues/queue.service';
import { TrafficHistoryService } from '../history/traffic-history.service';

@Injectable()
export class SensorEventService {
  constructor(
    @InjectRepository(SensorEvent)
    private readonly sensorEventRepository: Repository<SensorEvent>,

    @InjectRepository(Junction)
    private readonly junctionRepository: Repository<Junction>,

    private readonly queueService: QueueService,

    private readonly historyService: TrafficHistoryService,
  ) {}

  async create(
    dto: CreateSensorEventDto,
  ): Promise<SensorEvent> {
    const junction =
      await this.junctionRepository.findOne({
        where: {
          junctionId: dto.junctionId,
        },
      });

    if (!junction) {
      throw new NotFoundException(
        `Junction ${dto.junctionId} not found`,
      );
    }

    const existingEvent =
      await this.sensorEventRepository.findOne({
        where: {
          eventId: dto.eventId,
        },
      });

    if (existingEvent) {
      await this.historyService.create({
        junctionId: dto.junctionId,
        sensorId: dto.eventId,
        eventType: 'DUPLICATE_EVENT',
        direction: dto.direction,
        vehicleId: dto.vehicleId,
        description: `Event ${dto.eventId} has already been processed`,
      });

      throw new ConflictException(
        `Event ${dto.eventId} has already been processed`,
      );
    }

    const event =
      this.sensorEventRepository.create({
        eventId: dto.eventId,
        junctionId: dto.junctionId,
        direction: dto.direction,
        eventType: dto.eventType,
        vehicleId: dto.vehicleId,
        vehicleType: dto.vehicleType,
        sequenceNo: dto.sequenceNo,
        eventTimestamp: new Date(
          dto.eventTimestamp,
        ),
        processed: true,
      });

    const savedEvent =
      await this.sensorEventRepository.save(event);

    if (
      dto.eventType ===
      SensorEventType.VEHICLE_ARRIVED
    ) {
      await this.queueService.addVehicle({
        junctionId: dto.junctionId,
        direction: dto.direction,
        vehicleId: dto.vehicleId,
        vehicleType: dto.vehicleType,
        arrivedAt: new Date(
          dto.eventTimestamp,
        ),
      });

      await this.historyService.create({
        junctionId: dto.junctionId,
        sensorId: dto.eventId,
        eventType: 'VEHICLE_DETECTED',
        direction: dto.direction,
        vehicleId: dto.vehicleId,
        description: 'Vehicle arrived at junction',
      });
    }

    if (
      dto.eventType ===
      SensorEventType.VEHICLE_CLEARED
    ) {
      await this.queueService.clearVehicle(
        dto.junctionId,
        dto.vehicleId,
      );

      await this.historyService.create({
        junctionId: dto.junctionId,
        sensorId: dto.eventId,
        eventType: 'VEHICLE_CLEARED',
        direction: dto.direction,
        vehicleId: dto.vehicleId,
        description: 'Vehicle cleared the junction',
      });
    }

    return savedEvent;
  }

  async findAll(): Promise<SensorEvent[]> {
    return this.sensorEventRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}