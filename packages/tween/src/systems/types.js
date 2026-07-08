import { Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { TweenFlip, TweenRepeat } from '../components'
import { Tween } from '../components'
import { typeid } from '@wimaengine/type'

/**
 * @template T
 * @param {typeof Tween<T>} tween
 * @param {import('@wimaengine/type').Constructor<T>} valueType
 * @returns {import('@wimaengine/ecs').SystemFunc}
 */
export function registerTweenTypes(tween, valueType) {
  return function registerTweenTypes(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(tween, new StructInfo({
      duration: new Field(typeid(Number)),
      finish: new Field(typeid(Boolean)),
      to: new Field(typeid(valueType)),
      from: new Field(typeid(valueType)),
      easing: new Field(typeid(Function)),
      timeTaken: new Field(typeid(Number)),
      repeat: new Field(typeid(Boolean)),
      flip: new Field(typeid(Boolean))
    }))
    registry.get(tween)?.setMethod(tween.copy)
    registry.get(tween)?.setMethod(tween.clone)
  }
}

/**
 * @returns {import('@wimaengine/ecs').SystemFunc}
 */
export function registerTweenMarkerTypes() {
  return function registerTweenMarkerTypes(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(TweenFlip, new StructInfo({}))
    registry.register(TweenRepeat, new StructInfo({}))
    registry.get(TweenFlip)?.setMethod(TweenFlip.copy)
    registry.get(TweenFlip)?.setMethod(TweenFlip.clone)
    registry.get(TweenRepeat)?.setMethod(TweenRepeat.copy)
    registry.get(TweenRepeat)?.setMethod(TweenRepeat.clone)
  }
}
