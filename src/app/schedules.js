/**
 * The core schedules of an {@link App app}.
 *
 * @readonly
 * @enum {string}
 */
export const AppSchedule = {

  /**
   * The schedule that updates systems it contains every frame.
   * The frame rate is determined by the refesh rate of the device.
   * 
   */
  Update: 'mainupdate',

  /**
   * Schedule which runs once when the {@link App app} is 
   * {@link App.run run}.
   */
  Startup: 'startup'
}