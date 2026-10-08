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

import { GatesService } from './gates.service';
import { Gate } from './gate.entity';

@Controller('gates')
export class GatesController {
  constructor(private readonly gatesService: GatesService) {}

  @Get()
  findAll() {
    return this.gatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gatesService.findOne(id);
  }

  @Post()
  create(@Body() gateData: Partial<Gate>) {
    return this.gatesService.create(gateData);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() gateData: Partial<Gate>,
  ) {
    return this.gatesService.update(id, gateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gatesService.remove(id);
  }
}