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

import { VehiclesService } from './vehicles.service';
import { Vehicle } from './vehicle.entity';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // Get all vehicles
  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  // Get one vehicle
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  // Create a new vehicle
  @Post()
  create(@Body() vehicleData: Partial<Vehicle>) {
    return this.vehiclesService.create(vehicleData);
  }

  // Update a vehicle
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() vehicleData: Partial<Vehicle>,
  ) {
    return this.vehiclesService.update(id, vehicleData);
  }

  // Delete a vehicle
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.remove(id);
  }
}