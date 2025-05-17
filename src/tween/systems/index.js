/** @import {TweenLerp} from '../typedef/index.js' */
import { Query, World } from '../../ecs/index.js'
import { VirtualClock } from '../../time/index.js'
import { TweenFlip, TweenRepeat } from '../components/markers.js'
import { Tween } from '../components/tween.js'

/**
 * @template T
 * @param {typeof Tween<T>} tween
 */
export function generateTweenRepeatTween(tween) {

  /**
   * @param {World} world
   */
  return function repeatTween(world) {
    const query = new Query(world, [tween, TweenRepeat])

    query.each(([tween, _]) => {
      if (tween.timeTaken >= tween.duration) {
        tween.timeTaken = 0
      }

    })
  }
}

/**
 * @template T
 * @param {typeof Tween<T>} tween
 */
export function generateTweenFlipSystem(tween) {

  // `flipTween<T>` where `T => Tween<T>`
  /**
   * @param {World} world
   */
  return function flipTween(world) {
    const query = new Query(world, [tween, TweenFlip])

    query.each(([tween, _]) => {
      if (tween.timeTaken >= tween.duration) {

        const temp = tween.to

        tween.to = tween.from
        tween.from = temp
      }
    })
  }
}

/**
 * @template T
 * @param {typeof Tween<T>} tween
 */
export function generateTweenTimerSystem(tween) {

  /**
   * @param {World} world
   */
  return function updateTimerTween(world) {
    const dt = world.getResource(VirtualClock).getDelta()
    const query = new Query(world, [tween])

    query.each(([tween]) => {
      tween.timeTaken = Math.min(tween.timeTaken + dt, tween.duration)
    })
  }
}

/**
 * @template T
 * @param {new (args:any[]) => T} component
 * @param {typeof Tween<T>} tween
 * @param {TweenLerp<T>} interpolate
 */
export function generateTweenUpdateSystem(component, tween, interpolate) {

  /**
   * @param {World} world
   */
  return function updateTween(world) {
    const query = new Query(world, [component, tween])

    query.each(([component, tween]) => {
      const t = tween.easing(
        tween.timeTaken / tween.duration
      )

      interpolate(tween.from, tween.to, t, component)
    })
  }
}