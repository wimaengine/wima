import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import {
  Position2D,
  Orientation2D,
  Scale2D,
  GlobalTransform2D,
  Position3D,
  Orientation3D,
  Scale3D,
  GlobalTransform3D
} from '../components'
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
      .registerType(Position2D)
      .registerType(Orientation2D)
      .registerType(Scale2D)
      .registerType(GlobalTransform2D)
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
      .registerType(Position3D)
      .registerType(Orientation3D)
      .registerType(Scale3D)
      .registerType(GlobalTransform3D)
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
