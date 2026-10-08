import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { QueueService } from './queue.service';

@Controller('api/junctions')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
  ) {}

  @Get(':junctionId/queue')
  getQueue(
    @Param('junctionId') junctionId: string,
  ) {
    return this.queueService.getJunctionQueue(
      junctionId,
    );
  }

  @Get(':junctionId/queue/all')
  getAllQueues(
    @Param('junctionId') junctionId: string,
  ) {
    return this.queueService.getAllQueues(
      junctionId,
    );
  }
}