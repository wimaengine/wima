import { Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { TweenFlip, TweenRepeat } from '../components/index.js'
import { Tween } from '../components/tween.js'
import { typeid } from '../../type/index.js'

/**
 * @template T
 * @param {typeof Tween<T>} tween
 * @param {import('../../type/index.js').Constructor<T>} valueType
 * @returns {import('../../ecs/index.js').SystemFunc}
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
  }
}

/**
 * @returns {import('../../ecs/index.js').SystemFunc}
 */
export function registerTweenMarkerTypes() {
  return function registerTweenMarkerTypes(world) {
    const registry = world.getResource(TypeRegistry)

    registry.register(TweenFlip, new StructInfo({}))
    registry.register(TweenRepeat, new StructInfo({}))
  }
}
