import { Transition } from './transition';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/OnTransitionedEvent.cs
 */
export declare class OnTransitionedEvent<TState, TTrigger> {
    private readonly _onTransitioned;
    invoke(transition: Transition<TState, TTrigger>): Promise<void>;
    register(action: (transition: Transition<TState, TTrigger>) => any | Promise<any>): void;
}
