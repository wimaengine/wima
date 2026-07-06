/** @import {EntityHandle} from '../../ecs/index.js' */
import { App, Plugin } from '../../app/index.js'
import { AppSchedule } from '../../core/index.js'
import {
  drawArms,
  drawBounds,
  drawContacts,
  drawPosition,
  drawShapes,
  drawVelocity
} from '../systems/index.js'

export class Physics2DDebuggerPlugin extends Plugin {

  /**
   * @param {BodyDebbuggerOptions} options
   */
  constructor(options = {}) {
    super()
    options.drawCollisionArm = options.drawCollisionArm ?? false
    options.drawContacts = options.drawContacts ?? false
    options.drawPosition = options.drawPosition ?? false
    options.drawVelocity = options.drawVelocity ?? false
    options.drawBounds = options.drawBounds ?? false
    options.drawShapes = options.drawShapes ?? true
    this.options = options
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { options } = this

    if (options.drawPosition) app.registerSystem({ schedule: AppSchedule.Update, system: drawPosition })
    if (options.drawBounds) app.registerSystem({ schedule: AppSchedule.Update, system: drawBounds })
    if (options.drawShapes) app.registerSystem({ schedule: AppSchedule.Update, system: drawShapes })
    if (options.drawCollisionArm) app.registerSystem({ schedule: AppSchedule.Update, system: drawArms })
    if (options.drawContacts) app.registerSystem({ schedule: AppSchedule.Update, system: drawContacts })
    if (options.drawPosition) app.registerSystem({ schedule: AppSchedule.Update, system: drawPosition })
    if (options.drawVelocity) app.registerSystem({ schedule: AppSchedule.Update, system: drawVelocity })
  }
}

/**
 * @typedef BodyDebbuggerOptions
 * @property {boolean} [drawBounds=false]
 * @property {boolean} [drawPosition=false]
 * @property {boolean} [drawVelocity=false]
 * @property {boolean} [drawShapes=true]
 * @property {boolean} [drawCollisionArm=false]
 * @property {boolean} [drawContacts=false]
 * @property {boolean} [clearViewport=false]
 */
