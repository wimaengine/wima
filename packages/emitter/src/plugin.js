import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { CommandsPlugin } from '@wimaengine/command'
import { TimePlugin } from '@wimaengine/time'
import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
import { despawnParticles, emitParticles2D, emitParticles3D } from './systems'
import { typeid } from '@wimaengine/type'

export class Emitter2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: despawnParticles })
      .registerSystem({ schedule: AppSchedule.Update, system: emitParticles2D })

  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(CommandsPlugin),
      typeid(TimePlugin),
      typeid(Transform2DPlugin)
    ]
  }
}

export class Emitter3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Update, system: despawnParticles })
      .registerSystem({ schedule: AppSchedule.Update, system: emitParticles3D })

  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(CommandsPlugin),
      typeid(TimePlugin),
      typeid(Transform3DPlugin)
    ]
  }
}
