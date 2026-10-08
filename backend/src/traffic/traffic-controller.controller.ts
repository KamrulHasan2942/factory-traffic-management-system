import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { TrafficControllerService } from './traffic-controller.service';

import { TrafficCommandDto } from './dto/traffic-command.dto';

import { ControllerEventDto } from './dto/controller-event.dto';

@Controller('api/junctions')
export class TrafficControllerController {
  constructor(
    private readonly trafficControllerService: TrafficControllerService,
  ) {}

  @Post(':junctionId/evaluate')
  evaluate(
    @Param('junctionId') junctionId: string,
  ) {
    return this.trafficControllerService.evaluate(
      junctionId,
    );
  }

  @Post(':junctionId/commands')
  executeCommand(
    @Param('junctionId') junctionId: string,
    @Body() dto: TrafficCommandDto,
  ) {
    return this.trafficControllerService.executeCommand(
      junctionId,
      dto,
    );
  }

  /*
   * Controller ACK / failure events
   */
  @Post('/controller-events')
  controllerEvent(
    @Body() dto: ControllerEventDto,
  ) {
    return this.trafficControllerService.processControllerEvent(
      dto,
    );
  }

  /*
   * Controller status
   */
  @Get(':junctionId/status')
  getControllerStatus(
    @Param('junctionId') junctionId: string,
  ) {
    return this.trafficControllerService.getControllerStatus(
      junctionId,
    );
  }

  /*
   * Manually check pending command timeouts.
   */
  @Post('/controller-events/check-timeouts')
  checkTimeouts() {
    return this.trafficControllerService.checkCommandTimeouts();
  }
}