/** @import {ComponentHook} from '../../ecs/index.js' */

import { throws } from '../../logger/index.js'
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

  if(parent.entity.equals(entity)){
    throws(`THe entity ${entity.id()} cannot be its own parent!`)
  }
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

/**
 * Component hook that ensures the children of
 * an entity have the parent component referencing
 * the entity.
 * 
 * @type {ComponentHook}
 */
export function addSelfToChildren(entity, world) {
  const children = world.get(entity, Children)

  if (!children) {
    return
  }

  for (let i = 0; i < children.list.length; i++) {
    const child = children.list[i]
    const parent = world.get(child, Parent)

    if(child.equals(entity)){
      throws(`THe entity ${entity.id()} cannot be its own parent!`)
    }
    if (!parent) {
      world.insert(child, [new Parent(entity)])
    } else {
      parent.entity = entity
    }
  }
}

/**
 * Component hook that ensures when the parent
 * is despawned, the children entities are also
 * despawned 'recursively'.
 * 
 * @type {ComponentHook}
 */
export function despawnChildren(entity, world) {
  const children = world.get(entity, Children)

  if (!children) {
    return
  }

  for (let i = 0; i < children.list.length; i++) {
    const child = children.list[i]

    world.remove(child)
  }
}