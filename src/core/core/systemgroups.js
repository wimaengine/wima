/**
 * Core scheduling phases used by startup and update schedules.
 */
class Start {}

/**
 * Systems that should run before the main phase.
 */
class PreMain {}

/**
 * The default core phase for startup and update schedules.
 */
class Main {}

/**
 * Systems that should run after the main phase.
 */
class PostMain {}

/**
 * Final core scheduling phase.
 */
class End {}

/**
 *  @enum {import('../../type/index.js').Constructor}
 */
export const CoreSystems = Object.freeze({
  Start,
  PreMain,
  Main,
  PostMain,
  End
})
