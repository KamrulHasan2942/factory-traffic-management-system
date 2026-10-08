import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import {
  Direction,
  SensorEventType,
  VehicleType,
} from '../../traffic/domain/traffic.enums';

export class CreateSensorEventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  junctionId: string;

  @IsEnum(Direction)
  direction: Direction;

  @IsEnum(SensorEventType)
  eventType: SensorEventType;

  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsInt()
  @Min(1)
  sequenceNo: number;

  @IsDateString()
  eventTimestamp: string;
}