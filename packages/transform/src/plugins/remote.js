import { Plugin, App } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Transform2DPlugin, Transform3DPlugin } from './transform'
import { registerRemoteTransform2DTypes, registerRemoteTransform3DTypes, transformRemote2D, transformRemote3D } from '../systems'

export class RemoteTransform2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerRemoteTransform2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: transformRemote2D })
  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Transform2DPlugin)
    ]
  }
}

export class RemoteTransform3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, system: registerRemoteTransform3DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: transformRemote3D })
  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(MathPlugin),
      typeid(Transform3DPlugin)
    ]
  }
}
