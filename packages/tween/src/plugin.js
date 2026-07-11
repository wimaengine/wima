/** @import {TweenLerp} from './typedef' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { Vector2, Quaternion, Vector3, Rotary } from '@wimaengine/math'
import { Orientation2D, Orientation3D, Position2D, Position3D, Scale2D, Scale3D } from '@wimaengine/transform'
import { typeid, typeidGeneric } from '@wimaengine/type'
import {
  Position2DTween,
  Orientation2DTween,
  Scale2DTween,
  Position3DTween,
  Orientation3DTween,
  Scale3DTween,
  Tween
} from './components'
import { generateTweenFlipSystem, generateTweenRepeatTween, generateTweenTimerSystem, generateTweenUpdateSystem } from './systems'

// TODO: Convert this into a plugin group
export class DefaultTweenPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerPlugin(new CoreTweenPlugin())
      .registerPlugin(new TweenPlugin({
        component: Position2D,
        tween: Position2DTween,
        interpolation: Vector2.lerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Position3D,
        tween: Position3DTween,
        interpolation: Vector3.lerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Orientation2D,
        tween: Orientation2DTween,
        interpolation: Rotary.slerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Orientation3D,
        tween: Orientation3DTween,
        interpolation: Quaternion.slerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Scale2D,
        tween: Scale2DTween,
        interpolation: Vector2.lerp
      }))
      .registerPlugin(new TweenPlugin({
        component: Scale3D,
        tween: Scale3DTween,
        interpolation: Vector3.lerp
      }))
  }
}

export class CoreTweenPlugin extends Plugin {

  /**
   * @param {App} _app
   */
  register(_app) { }

}

// TweenPlugin<T> where `T: Lerp`
// e.g TweenPlugin<Position2D>, TweenPlugin<Scale2D> e.t.c...
// For now,this plugin will be limited to Position,Orientation and Scale (2d and 3d variants) components.
/**
 * @template T
 */
export class TweenPlugin extends Plugin {

  /**
   * @readonly
   * @type {new (...args:any[])=>T}
   */
  component

  /**
   * @readonly
   * @type {typeof Tween<T>}
   */
  tween

  /**
   * @readonly
   * @type {TweenLerp<T>}
   */
  interpolation

  /**
   * @param {TweenPluginOptions<T>} options
   */
  constructor({ component, tween, interpolation }) {
    super()
    this.component = component
    this.interpolation = interpolation
    this.tween = tween
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `flipTween<${typeid(this.component)}>`,
        system: generateTweenFlipSystem(this.tween)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `repeatTween<${typeid(this.component)}>`,
        system: generateTweenRepeatTween(this.tween)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `updateTimerTween<${typeid(this.component)}>`,
        system: generateTweenTimerSystem(this.tween)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        label: `updateTween<${typeid(this.component)}>`,
        system: generateTweenUpdateSystem(this.component, this.tween, this.interpolation)
      })
  }

  name() {
    return typeidGeneric(TweenPlugin, [this.component])
  }
}

/**
 * @template T
 * @typedef TweenPluginOptions
 * @property {new (...args:any[])=>T} component
 * @property {typeof Tween<T>} tween
 * @property {TweenLerp<T>} interpolation
 */
