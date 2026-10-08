import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { JunctionService } from './junction.service';

@Controller('api/junctions')
export class JunctionController {
  constructor(
    private readonly junctionService: JunctionService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.junctionService.create(body);
  }

  @Get()
  findAll() {
    return this.junctionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.junctionService.findOne(id);
  }
}