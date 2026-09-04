import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { Movable2DPlugin, Movable3DPlugin } from '@wimaengine/movable'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Linear2DDamping, Angular2DDamping, Linear3DDamping, Angular3DDamping } from './resources'
import { dampenRotation2D, dampenRotation3D, dampenVelocity2D, dampenVelocity3D, registerDamping2DTypes, registerDamping3DTypes } from './systems'

export class Damping2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Linear2DDamping(0.01))
      .setResource(new Angular2DDamping(0.01))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerDamping2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenVelocity2D })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenRotation2D })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(Movable2DPlugin)]
  }
}

export class Damping3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new Linear3DDamping(0.01))
      .setResource(new Angular3DDamping(0.01))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerDamping3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenVelocity3D })
      .registerSystem({ schedule: AppSchedule.Update, system: dampenRotation3D })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(Movable3DPlugin)]
  }
}
