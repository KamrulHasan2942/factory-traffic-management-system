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

import { DriversService } from './drivers.service';
import { Driver } from './driver.entity';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  // Get all drivers
  @Get()
  findAll() {
    return this.driversService.findAll();
  }

  // Get one driver
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driversService.findOne(id);
  }

  // Create a new driver
  @Post()
  create(@Body() driverData: Partial<Driver>) {
    return this.driversService.create(driverData);
  }

  // Update a driver
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() driverData: Partial<Driver>,
  ) {
    return this.driversService.update(id, driverData);
  }

  // Delete a driver
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.driversService.remove(id);
  }
}