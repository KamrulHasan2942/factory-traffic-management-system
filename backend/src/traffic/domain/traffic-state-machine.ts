import {
  Phase,
  SignalState,
} from './traffic.enums';

export interface SignalTransition {
  phase: Phase;
  state: SignalState;
}

export class TrafficStateMachine {

  getSafeTransition(
    current: Phase,
    target: Phase,
  ): SignalTransition[] {

    if (current === target) {
      return [];
    }

    if (current === Phase.ALL_RED) {
      return [
        {
          phase: target,
          state: SignalState.GREEN,
        },
      ];
    }

    return [
      {
        phase: current,
        state: SignalState.YELLOW,
      },
      {
        phase: Phase.ALL_RED,
        state: SignalState.RED,
      },
      {
        phase: target,
        state: SignalState.GREEN,
      },
    ];
  }
}