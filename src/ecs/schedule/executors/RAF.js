import { World } from '../../registry.js'
import { Schedule } from '../schedule.js'
import { Executor } from './executor.js'

/**
 * This executor executes once every frame after it is
 * {@link RAFExecutor.start started}.
 * The frame rate is detemined by the device's display
 * refresh rate.Most common refresh rate is 60Hz with
 * other refresh rates e.g 30Hz, 40Hz, 75Hz, 120Hz and
 * 144Hz also being common.
 * 
 * This is a wrapper around {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame `requestAnimationFrame`}.
 */
export class RAFExecutor extends Executor{

  /**
   * @param {World} world
   * @param {Schedule} schedule
   */
  start(world, schedule) {
    this.tick = requestAnimationFrame(execute.bind(this))

    /**
     * @this {RAFExecutor}
     */
    function execute(){
      schedule.run(world)
      this.tick = requestAnimationFrame(execute.bind(this))
    }
  }
stop() {
    cancelAnimationFrame(this.tick)
  }
}