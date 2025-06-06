/** @import {Constructor, TypeId,} from '../types/index.js' */
/**
 * @template T
 * @param {Constructor<T>} type 
 * @returns {TypeId}
 */
export function typeid(type) {
  return type.name
}