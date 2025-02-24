/** @import {Entity} from '../../ecs/index.js' */
import { App, AppSchedule, Plugin } from '../../app/index.js'
import {
  drawArms,
  drawBounds,
  drawContacts,
  drawPosition,
  drawShapes,
  drawVelocity
} from '../systems/index.js'


export class Physics2DDebuggerPlugin extends Plugin{

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

    if (options.drawPosition) app.registerSystem(AppSchedule.Update, drawPosition)
    if (options.drawBounds) app.registerSystem(AppSchedule.Update, drawBounds)
    if (options.drawShapes) app.registerSystem(AppSchedule.Update, drawShapes)
    if (options.drawCollisionArm) app.registerSystem(AppSchedule.Update, drawArms)
    if (options.drawContacts) app.registerSystem(AppSchedule.Update, drawContacts)
    if (options.drawPosition) app.registerSystem(AppSchedule.Update, drawPosition)
    if (options.drawVelocity) app.registerSystem(AppSchedule.Update, drawVelocity)
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