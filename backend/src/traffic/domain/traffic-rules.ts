import {
  Direction,
  Phase,
  VehicleType,
} from './traffic.enums';

export function getVehiclePriority(
  type: VehicleType,
): number {
  switch (type) {
    case VehicleType.EMERGENCY:
      return 1000;

    case VehicleType.TRUCK:
      return 300;

    case VehicleType.FORKLIFT:
      return 200;

    case VehicleType.EMPLOYEE_VEHICLE:
      return 100;

    default:
      return 0;
  }
}

export function getPhase(
  direction: Direction,
): Phase {
  if (
    direction === Direction.NORTH ||
    direction === Direction.SOUTH
  ) {
    return Phase.NORTH_SOUTH;
  }

  return Phase.EAST_WEST;
}

export function isConflicting(
  current: Phase,
  requested: Phase,
): boolean {
  if (
    current === Phase.NORTH_SOUTH &&
    requested === Phase.EAST_WEST
  ) {
    return true;
  }

  if (
    current === Phase.EAST_WEST &&
    requested === Phase.NORTH_SOUTH
  ) {
    return true;
  }

  return false;
}