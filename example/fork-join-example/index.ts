/**
 * @link: https://github.com/dotnet-state-machine/stateless/issues/241
 */

import { State } from './state';
import { ForkState, Trigger } from './fork-state';
import { StateMachine } from '../../src';

const initialState = new State('initialState');
const forkState = new ForkState('forkState');
const endState = new State('endState');

const _stateMachine = new StateMachine<State, Trigger>(initialState);

_stateMachine.configure(initialState)
  .onActivate(initialState.onEntry.bind(initialState))
  .permit(Trigger.Fork, forkState)
  .onExit(initialState.onExit.bind(initialState));

_stateMachine.configure(forkState)
  .onEntry(forkState.onEntry.bind(forkState))
  .internalTransition(Trigger.A, t => forkState.fire(t.trigger))
  .internalTransition(Trigger.B, t => forkState.fire(t.trigger))
  .permitIf(Trigger.End, endState, forkState.endGuard.bind(forkState))
  .onExit(forkState.onExit.bind(forkState));

_stateMachine.configure(endState)
  .onEntry(endState.onEntry.bind(endState));

(async () => {
  await _stateMachine.activate();
  await fire(Trigger.Fork);
  await fire(Trigger.A);
  await fire(Trigger.B);
  await fire(Trigger.End);
  console.log();
})();

async function fire(trigger: Trigger): Promise<any> {
  console.log(`Firing trigger ${trigger}`);
  await _stateMachine.fire(trigger);
}
