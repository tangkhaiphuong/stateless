import { StateRepresentation } from '../state-pepresentation';
import { IgnoredTransitionInfo } from './ignored-transition-info';
import { IgnoredTriggerBehaviour } from '../ignored-trigger-behaviour';
import { InternalTriggerBehaviour } from '../internal-trigger-behaviour';
import { TransitioningTriggerBehaviour } from '../transitioning-trigger-behaviour';
import { DynamicTriggerBehaviour } from '../dynamic-trigger-behaviour';
import { ReentryTriggerBehaviour } from '../reentry-trigger-behaviour';
import { InvocationInfo } from './invocation-info';
import { FixedTransitionInfo } from './fixed-transition-info';
import { DynamicTransitionInfo } from './dynamic-transition-info';
import { ActionInfo } from './action-info';
import { TransitionInfo } from './transition-info';

/**
 * Describes an internal StateRepresentation through the reflection API.
 * 
 * @export
 * @class StateInfo
 * @template TState 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateInfo.cs
 */
export class StateInfo<TState> {

  private _dynamicTransitions: Iterable<DynamicTransitionInfo<TState>> = [];
  private _fixedTransitions: Iterable<FixedTransitionInfo<TState>> = [];
  private _superstate: StateInfo<TState> | null = null;
  private _substates: Iterable<StateInfo<TState>> = [];

  public static createStateInfo<TState, TTrigger>(
    stateRepresentation: StateRepresentation<TState, TTrigger>,
    isActive: boolean = false,
  ): StateInfo<TState> {

    const ignoredTriggers: IgnoredTransitionInfo[] = [];

    // stateRepresentation.triggerBehaviours maps from TTrigger to ICollection<TriggerBehaviour>
    for (const triggerBehaviours of stateRepresentation.triggerBehaviours) {
      for (const item of triggerBehaviours['1']) {
        if (item instanceof IgnoredTriggerBehaviour) {
          ignoredTriggers.push(IgnoredTransitionInfo.create(item));
        }
      }
    }

    return new StateInfo(
      stateRepresentation.underlyingState,
      ignoredTriggers,
      stateRepresentation.entryActions.map(e => ActionInfo.create(e)),
      stateRepresentation.activateActions.map(e => e.description),
      stateRepresentation.deactivateActions.map(e => e.description),
      stateRepresentation.exitActions.map(e => e.description),
      isActive);
  }

  /**
   * Creates an instance of StateInfo.
   * @param {TState} _underlyingState 
   * @param {Iterable<IgnoredTransitionInfo>} _ignoredTriggers 
   * @param {Iterable<ActionInfo>} _entryActions 
   * @param {Iterable<InvocationInfo>} _activateActions 
   * @param {Iterable<InvocationInfo>} _deactivateActions 
   * @param {Iterable<InvocationInfo>} _exitActions 
   * @param {boolean} [_isActive=false] 
   * @memberof StateInfo
   */
  constructor(
    private readonly _underlyingState: TState,
    private readonly _ignoredTriggers: Iterable<IgnoredTransitionInfo>,
    private readonly _entryActions: Iterable<ActionInfo>,
    private readonly _activateActions: Iterable<InvocationInfo>,
    private readonly _deactivateActions: Iterable<InvocationInfo>,
    private readonly _exitActions: Iterable<InvocationInfo>,
    private readonly _isActive: boolean = false) {
  }

  public static addRelationships<TState, TTrigger>(
    info: StateInfo<TState>,
    stateRepresentation: StateRepresentation<TState, TTrigger>,
    lookupState: (state: TState) => StateInfo<TState>, ) {

    const substates = stateRepresentation.getSubstates().map(s => lookupState(s.underlyingState) || null);

    let superstate: StateInfo<TState> | undefined;
    if (!!stateRepresentation.superstate) {
      superstate = lookupState(stateRepresentation.superstate.underlyingState);
    }

    const fixedTransitions: Array<FixedTransitionInfo<TState>> = [];
    const dynamicTransitions: Array<DynamicTransitionInfo<TState>> = [];

    for (const triggerBehaviours of stateRepresentation.triggerBehaviours) {
      // First add all the deterministic transitions
      for (const item of triggerBehaviours['1'].filter(behaviour => (behaviour instanceof TransitioningTriggerBehaviour))) {
        const destinationInfo = lookupState((item as TransitioningTriggerBehaviour<TState, TTrigger>).destination);
        if (!destinationInfo) { continue; }
        fixedTransitions.push(FixedTransitionInfo.create(item, destinationInfo));
      }

      for (const item of triggerBehaviours['1'].filter(behaviour => (behaviour instanceof ReentryTriggerBehaviour))) {
        const destinationInfo = lookupState((item as ReentryTriggerBehaviour<TState, TTrigger>).destination);
        if (!destinationInfo) { continue; }
        fixedTransitions.push(FixedTransitionInfo.create(item, destinationInfo));
      }

      // Then add all the internal transitions
      for (const item of triggerBehaviours['1'].filter(behaviour => (behaviour instanceof InternalTriggerBehaviour))) {
        const destinationInfo = lookupState(stateRepresentation.underlyingState);
        if (!destinationInfo) { continue; }
        fixedTransitions.push(FixedTransitionInfo.create(item, destinationInfo));
      }
      // Then add all the dynamic transitions
      for (const item of triggerBehaviours['1'].filter(behaviour => behaviour instanceof DynamicTriggerBehaviour)) {
        dynamicTransitions.push((item as DynamicTriggerBehaviour<TState, TTrigger>).transitionInfo);
      }
    }

    info.addRelationships(superstate || null, substates, fixedTransitions, dynamicTransitions);
  }

  private addRelationships(
    superstate: StateInfo<TState> | null,
    substates: Iterable<StateInfo<TState>>,
    transitions: Iterable<FixedTransitionInfo<TState>>,
    dynamicTransitions: Iterable<DynamicTransitionInfo<TState>>) {
    this._superstate = superstate;
    this._substates = substates;
    this._fixedTransitions = transitions;
    this._dynamicTransitions = dynamicTransitions;
  }

  /**
   * Checking this is current state.
   * 
   * @readonly
   * @type {{}
   * @memberof StateInfo
   */
  public get isActive(): boolean { return this._isActive; }

  /**
   * The instance or value this state represents.
   * 
   * @readonly
   * @type {*}
   * @memberof StateInfo
   */
  public get underlyingState(): TState { return this._underlyingState; }

  /**
   * Substates defined for this StateResource.
   * 
   * @readonly
   * @type {(Iterable<StateInfo | null>)}
   * @memberof StateInfo
   */
  public get substates(): Iterable<StateInfo<TState>> { return this._substates; }

  /**
   * Superstate defined, if any, for this StateResource.
   * 
   * @readonly
   * @type {StateInfo}
   * @memberof StateInfo
   */
  public get superstate(): StateInfo<TState> | null { return this._superstate; }

  /**
   * Actions that are defined to be executed on state-entry.
   * 
   * @readonly
   * @type {Iterable<ActionInfo>}
   * @memberof StateInfo
   */
  public get entryActions(): Iterable<ActionInfo> { return this._entryActions; }

  /**
   * Actions that are defined to be executed on activation.
   * 
   * @readonly
   * @type {Iterable<InvocationInfo>}
   * @memberof StateInfo
   */
  public get activateActions(): Iterable<InvocationInfo> { return this._activateActions; }

  /**
   * Actions that are defined to be executed on deactivation.
   * 
   * @readonly
   * @type {Iterable<InvocationInfo>}
   * @memberof StateInfo
   */
  public get deactivateActions(): Iterable<InvocationInfo> { return this._deactivateActions; }

  /**
   * Actions that are defined to be exectuted on state-exit.
   * 
   * @readonly
   * @type {Iterable<InvocationInfo>}
   * @memberof StateInfo
   */
  public get exitActions(): Iterable<InvocationInfo> { return this._exitActions; }

  /**
   * Transitions defined for this state.
   * 
   * @readonly
   * @type {Iterable<TransitionInfo>}
   * @memberof StateInfo
   */
  public get transitions(): Iterable<TransitionInfo> { return [...(this._fixedTransitions || []), ...(this._dynamicTransitions || [])]; }

  /**
   * Transitions defined for this state.
   * 
   * @readonly
   * @type {Iterable<FixedTransitionInfo<TState>>}
   * @memberof StateInfo
   */
  public get fixedTransitions(): Iterable<FixedTransitionInfo<TState>> { return this._fixedTransitions; }

  /**
   * Dynamic Transitions defined for this state internally.
   * 
   * @readonly
   * @type {Iterable<DynamicTransitionInfo<TState>>}
   * @memberof StateInfo
   */
  public get dynamicTransitions(): Iterable<DynamicTransitionInfo<TState>> { return this._dynamicTransitions; }

  /**
   * Triggers ignored for this state.
   * 
   * @readonly
   * @type {Iterable<IgnoredTransitionInfo>}
   * @memberof StateInfo
   */
  public get ignoredTriggers(): Iterable<IgnoredTransitionInfo> { return this._ignoredTriggers; }

  /**
   * Passes through to the value's ToString.
   * 
   * @returns {string} 
   * @memberof StateInfo
   */
  public toString(): string {
    return !!this._underlyingState ? `${this._underlyingState}` : '<null2>';
  }

}
