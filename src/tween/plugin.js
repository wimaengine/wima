/** @import {TweenLerp} from './typedef/index.js' */
import { App, AppSchedule, Plugin } from '../app/index.js'
import {
  Position2DTween,
  Orientation2DTween,
  Scale2DTween,
  Position3DTween,
  Orientation3DTween,
  Scale3DTween,
  TweenFlip,
  TweenRepeat,
  Tween
} from './components/index.js'
import { Vector2, Quaternion, Vector3, Angle } from '../math/index.js'
import { generateTweenFlipSystem, generateTweenRepeatTween, generateTweenTimerSystem, generateTweenUpdateSystem } from './systems/index.js'
import { Orientation2D, Orientation3D, Position2D, Position3D, Scale2D, Scale3D } from '../transform/index.js'
import { typeidGeneric } from '../reflect/index.js'

export class DefaultTweenPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerType(TweenFlip)
      .registerType(TweenRepeat)
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
        interpolation: Angle.lerp
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

// TweenPlugin<T> where `T: Lerp`
// e.g TweenPlugin<Position2D>, TweenPlugin<Scale2D> e.t.c...
// For now,this plugin will be limited to Position,Orientation and Scale (2d and 3d variants) components.
/**
 * @template T
 */
export class TweenPlugin extends Plugin{

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
      .registerType(this.tween)
      .registerType(TweenFlip)
      .registerType(TweenRepeat)
      .registerSystem(AppSchedule.Update, generateTweenFlipSystem(this.tween))
      .registerSystem(AppSchedule.Update, generateTweenRepeatTween(this.tween))
      .registerSystem(AppSchedule.Update, generateTweenTimerSystem(this.tween))
      .registerSystem(AppSchedule.Update, generateTweenUpdateSystem(this.component, this.tween, this.interpolation))
  }

  name(){
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