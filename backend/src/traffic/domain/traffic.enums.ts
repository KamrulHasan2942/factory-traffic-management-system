export enum Direction {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
}

export enum Phase {
  NORTH_SOUTH = 'NORTH_SOUTH',
  EAST_WEST = 'EAST_WEST',
  ALL_RED = 'ALL_RED',
}

export enum SignalState {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
}

export enum TrafficMode {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  EMERGENCY = 'EMERGENCY',
  DEGRADED = 'DEGRADED',
}

export enum VehicleType {
  FORKLIFT = 'FORKLIFT',
  TRUCK = 'TRUCK',
  EMPLOYEE_VEHICLE = 'EMPLOYEE_VEHICLE',
  EMERGENCY = 'EMERGENCY',
}

export enum SensorEventType {
  VEHICLE_ARRIVED = 'VEHICLE_ARRIVED',
  VEHICLE_CLEARED = 'VEHICLE_CLEARED',
}