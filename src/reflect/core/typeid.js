/** @import {Constructor, TypeId,} from '../types/index.js' */
/**
 * @template T
 * @param {Constructor<T>} type 
 * @returns {TypeId}
 */
export function typeid(type) {
  return /** @type {TypeId}*/(type.name)
}

/**
 * @template T
 * @template {Constructor[]} U
 * @param {Constructor<T>} type 
 * @param {[...U]} types
 * @returns {TypeId}
 */
export function typeidGeneric(type, types) {
  if(!types.length){
    return typeid(type)
  }

  let name = `${type.name}<`
  
  for (let i = 0; i < types.length - 1; i++) {
    name += `${types[i].name},`
  }

  name += `${types[types.length - 1].name}>`
 
  return /** @type {TypeId}*/(name)
}