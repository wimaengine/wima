/** @import {ComponentHook} from '@wimaengine/ecs' */

import { throws } from '@wimaengine/logger'
import { Children, Parent } from '../components'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Adds an entity to the `Children` relationship of its {@linkcode Parent} entity.
 *
 * {@linkcode HierarchyPlugin} installs this hook for additions of the `Parent`
 * component. It reads the child's `Parent` component from `world`; when the
 * component is absent, the hook does nothing. A parent that refers to the
 * same entity is rejected. Otherwise, an existing {@linkcode Children} component
 * receives the child handle with {@linkcode Children#add}; if the parent has no
 * `Children` component yet, the hook inserts one containing this child.
 *
 * The new component is inserted directly with `world.insert()` so the
 * relationship is available even when other entity-command insertions are
 * queued for the same parent.
 *
 * @type {ComponentHook}
 * @category component-hook
 * @example
 * ```js
 * // Spawning this child lets HierarchyPlugin add it to root's Children.
 * const child = world.spawn([new Parent(root)])
 * ```
 */
export function addSelfToParent(entity, world) {
  const parent = world.get(entity, Parent)

  if (!parent) return

  const children = world.get(parent.entity, Children)

  if (parent.entity.equals(entity)) {
    throws(`The entity ${entity.id()} cannot be its own parent!`)
  }
  if (children) {
    if (!children.list.some((child) => child.equals(entity))) {
      children.add(entity)
    }
  } else {

    // Immediate insertion as insert commands on
    // `EntityCommands` will override each other.
    world.insert(parent.entity, [new Children([entity])])
  }
}

/**
 * Removes an entity from its parent's {@linkcode Children} relationship.
 *
 * {@linkcode HierarchyPlugin} installs this hook for removals of the `Parent`
 * component. The hook reads `Parent` from the child and then looks up
 * `Children` on the referenced parent. It is a no-op when either component is
 * absent. When both exist, removal is delegated to {@linkcode Children#remove},
 * which matches the exact `EntityHandle` object with strict identity rather
 * than using `EntityHandle.equals`. If that exact handle is not present,
 * {@linkcode Children#remove} currently removes the final list entry because it passes
 * `-1` to `Array.prototype.splice`; the hook is a no-op only when either
 * relationship component is absent.
 *
 * @type {ComponentHook}
 * @category component-hook
 * @example
 * ```js
 * // Removing Parent triggers removal from the parent's Children component.
 * world.remove(child, [Parent])
 * ```
 */
export function removeSelfFromParent(entity, world) {
  const parent = world.get(entity, Parent)

  if (!parent) return

  const children = world.get(parent.entity, Children)

  children?.remove(entity)
}

/**
 * Synchronizes each child in an entity's {@linkcode Children} component with a
 * {@linkcode Parent} component pointing back to that entity.
 *
 * {@linkcode HierarchyPlugin} installs this hook for the addition of a `Children`
 * component. It looks up `Children` on the entity and does nothing when the
 * component is absent. When present, it walks the live `children.list` by
 * index, so the hook processes the list as it exists during the lifecycle
 * operation rather than a copied snapshot.
 *
 * A child that equals the entity receiving `Children` is rejected as a
 * self-parent. For every other child, the hook inserts a new `Parent` directly
 * when the child has no parent; when a `Parent` already exists, it updates that
 * component's `entity` field to the entity receiving `Children`.
 *
 * This is the `Children`-addition side of the hierarchy relationship. It keeps
 * the two components synchronized during the component lifecycle; it does not
 * create a `Children` component or despawn entities. Use
 * {@linkcode HierarchyPlugin} to install this behavior in an app.
 *
 * @type {ComponentHook}
 * @category component-hook
 * @example
 * ```js
 * // Adding Children assigns root as the Parent of each listed child.
 * world.insert(root, [new Children([child])])
 * console.log(world.get(child, Parent).entity.equals(root)) // true
 * ```
 */
export function addSelfToChildren(entity, world) {
  const children = world.get(entity, Children)

  if (!children) {
    return
  }

  for (let i = 0; i < children.list.length; i++) {
    const child = children.list[i]
    const parent = world.get(child, Parent)

    if (child.equals(entity)) {
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
 * Despawns every child when an entity is despawned.
 *
 * {@linkcode HierarchyPlugin} installs this {@linkcode ComponentHook} for the
 * {@linkcode Children} relationship. If the entity has no {@linkcode Children}
 * component, the hook is a no-op. Otherwise, it walks the child handles in
 * reverse order and calls {@linkcode World#despawn} for each one. Despawning a
 * child can recursively despawn its own descendants and remove the child from
 * this entity's `Children` list, so the reverse-order loop must remain in
 * place while that list is being mutated; iterating forward could skip the
 * entry that shifts into the current index.
 *
 * @type {ComponentHook}
 * @category component-hook
 */
export function despawnChildren(entity, world) {
  const children = world.get(entity, Children)

  if (!children) {
    return
  }

  // Do not change this loop as children are despawned.
  for (let i = children.list.length - 1; i >= 0; i--) {
    const child = children.list[i]

    world.despawn(child)
  }
}
