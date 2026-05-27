/**
 * Core schedule labels used by an {@link App app}.
 */
class Startup {}

/**
 * Main loop schedule.
 */
class Update {}

export const AppSchedule = Object.freeze({

  /**
   * The schedule that updates systems it contains every frame.
   * The frame rate is determined by the refresh rate of the device.
   */
  Update,

  /**
   * Schedule which runs once when the {@link App app} is
   * {@link App.run run}.
   */
  Startup
})
