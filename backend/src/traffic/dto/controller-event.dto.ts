import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  Phase,
  SignalState,
} from '../domain/traffic.enums';

export enum ControllerEventType {
  ACK = 'ACK',
  FAILED = 'FAILED',
}

export class ControllerEventDto {
  @IsString()
  @IsNotEmpty()
  commandId: string;

  @IsString()
  @IsNotEmpty()
  junctionId: string;

  @IsEnum(ControllerEventType)
  eventType: ControllerEventType;

  @IsOptional()
  @IsEnum(Phase)
  actualPhase?: Phase;

  @IsOptional()
  @IsEnum(SignalState)
  actualState?: SignalState;

  @IsOptional()
  @IsString()
  failureReason?: string;
}