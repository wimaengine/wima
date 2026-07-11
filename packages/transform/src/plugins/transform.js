import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { propagateTransform2D, propagateTransform3D, registerTransform2DTypes, registerTransform3DTypes, synctransform2D, synctransform3D } from '../systems'

export class TransformSystems { }
export class Transform2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app

      // TODO: Also register this in the 3d variant
      .registerSystemGroup({
        label: TransformSystems,
        schedule: AppSchedule.Update
      })
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerTransform2DTypes
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        system: synctransform2D
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        system: propagateTransform2D,
        after: [synctransform2D]
      })
  }
}

export class Transform3DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerTransform3DTypes
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: TransformSystems,
        system: synctransform3D
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: TransformSystems,
        system: propagateTransform3D,
        after: [synctransform3D]
      })
  }
}
