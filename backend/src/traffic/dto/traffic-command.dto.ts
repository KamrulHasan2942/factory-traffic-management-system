import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { Phase } from '../domain/traffic.enums';

export enum TrafficCommand {
  SET_PHASE = 'SET_PHASE',
  SET_AUTOMATIC = 'SET_AUTOMATIC',
}

export class TrafficCommandDto {
  @IsEnum(TrafficCommand)
  command: TrafficCommand;

  @IsOptional()
  @IsEnum(Phase)
  targetPhase?: Phase;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reason?: string;
}