/**
 * Enum for the different modes used when Fire-ing a trigger.
 * 
 * @export
 * @enum {number}
 */
export enum FiringMode {
  /**
   * Use immediate mode when the queing of trigger events are not needed. Care must be taken when using this mode, as there is no run-to-completion guaranteed.
   */
  Immediate = 'Immediate',
  /**
   * Use the queued Fire-ing mode when run-to-completion is required. This is the recommended mode.
   */
  Queued = 'Queued'
}
