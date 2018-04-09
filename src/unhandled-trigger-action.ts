/**
 *  * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviourResult.cs
 * 
 * @export
 * @class UnhandledTriggerAction
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/UnhandledTriggerAction.cs
 */
export class UnhandledTriggerAction<TState, TTrigger, TContext = undefined> {

  constructor(private readonly _action: ((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>) | ((context: TContext, state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>)) { }

  public async execute(state: TState, trigger: TTrigger, unmetGuards: string[], context?: TContext): Promise<void> {
    const action = this._action as any;
    const result = !!context ? action(context, state, trigger, unmetGuards) : action(state, trigger, unmetGuards);
    if (result instanceof Promise) {
      await result;
    }
  }
}
