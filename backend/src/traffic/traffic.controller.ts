import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { TrafficService } from './traffic.service';
import { Traffic } from './traffic.entity';

@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  findAll() {
    return this.trafficService.findAll();
  }

  @Post('entry')
  vehicleEntry(
    @Body()
    entryData: {
      vehicleId: number;
      driverId: number;
      gateId: number;
    },
  ) {
    return this.trafficService.vehicleEntry(
      entryData.vehicleId,
      entryData.driverId,
      entryData.gateId,
    );
  }

  @Post()
  create(@Body() trafficData: Partial<Traffic>) {
    return this.trafficService.create(trafficData);
  }

  @Patch(':id/exit')
  vehicleExit(@Param('id', ParseIntPipe) id: number) {
    return this.trafficService.vehicleExit(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trafficService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() trafficData: Partial<Traffic>,
  ) {
    return this.trafficService.update(id, trafficData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trafficService.remove(id);
  }
}