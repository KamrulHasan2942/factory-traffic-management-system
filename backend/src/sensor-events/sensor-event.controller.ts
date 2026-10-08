import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { SensorEventService } from './sensor-event.service';
import { CreateSensorEventDto } from './dto/sensor-event.dto';

@Controller('api/sensor-events')
export class SensorEventController {
  constructor(
    private readonly sensorEventService: SensorEventService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateSensorEventDto,
  ) {
    return this.sensorEventService.create(dto);
  }

  @Get()
  findAll() {
    return this.sensorEventService.findAll();
  }
}