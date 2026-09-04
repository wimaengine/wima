/** @import {EntityHandle} from '@wimaengine/ecs' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Broadphase2DPlugin } from '@wimaengine/broadphase'
import { Movable2DPlugin } from '@wimaengine/movable'
import { NarrowPhase2DPlugin } from '@wimaengine/narrowphase'
import { Transform2DPlugin } from '@wimaengine/transform'
import { WindowPlugin } from '@wimaengine/window'
import {
  drawArms,
  drawBounds,
  drawContacts,
  drawPosition,
  drawShapes,
  drawVelocity
} from '../systems'
import { typeid } from '@wimaengine/type'

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

  requires() {
    return [
      typeid(CorePlugin),
      typeid(WindowPlugin),
      typeid(Broadphase2DPlugin),
      typeid(NarrowPhase2DPlugin),
      typeid(Transform2DPlugin),
      typeid(Movable2DPlugin)
    ]
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
