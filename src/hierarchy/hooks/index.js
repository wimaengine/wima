/** @import {ComponentHook} from '../../ecs/index.js' */

import { Children, Parent } from '../components/index.js'


/**
 * Component hook that ensures when a child 
 * entity is spawned, the parent list is 
 * updated.
 * 
 * @type {ComponentHook}
 */
export function addSelfToParent(entity, world) {
  const parent = world.get(entity, Parent)

  if (!parent) return

  const children = world.get(parent.entity, Children)

  if (children) {
    children?.add(entity)
  } else {

    // Immediate insertion as insert commands on 
    // `EntityCommands` will override each other.
    world.insert(parent.entity, [new Children([entity])])
  }
}

/**
 * Component hook that ensures when a child 
 * entity is despawned, the parent list is 
 * updated.
 * 
 * @type {ComponentHook}
 */
export function removeSelfFromParent(entity, world) {
  const parent = world.get(entity, Parent)

  if (!parent) return

  const children = world.get(parent.entity, Children)

  children?.remove(entity)
}