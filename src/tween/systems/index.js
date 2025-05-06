/** @import {TweenLerp} from '../typedef/index.js' */
import { Query, World } from '../../ecs/index.js'
import { TweenRepeat } from '../components/markers.js'
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
 * @param {Function} tween
 */
export function generateTweenFlipSystem(tween) {
  const name = tween.name.toLowerCase()


  // `flipTween<T>` where `T => Tween<T>`
  /**
   * @param {World} world
   */
  return function flipTween(world) {
    const query = new Query(world, [name, 'tweenflip'])

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
 * @param {Function} tween
 */
export function generateTweenTimerSystem(tween) {
  const name = tween.name.toLowerCase()

  /**
   * @param {World} world
   */
  return function updateTimerTween(world) {
    const dt = world.getResource('virtualclock').delta
    const query = new Query(world, [name])

    query.each(([tween]) => {
      tween.timeTaken = Math.min(tween.timeTaken + dt, tween.duration)
    })
  }
}

/**
 * @template T
 * @param {Function} component
 * @param {Function} tween
 * @param {TweenLerp<T>} interpolate
 */
export function generateTweenUpdateSystem(component, tween, interpolate) {
  const name = component.name.toLowerCase()
  const tweenName = tween.name.toLowerCase()


  /**
   * @param {World} world
   */
  return function updateTween(world) {
    const query = new Query(world, [name, tweenName])

    query.each(([component, tween]) => {
      const t = tween.easing(
        tween.timeTaken / tween.duration
      )

      interpolate(tween.from, tween.to, t, component)
    })
  }
}