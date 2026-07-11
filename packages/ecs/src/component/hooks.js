/** @import { ComponentHook } from '../typedef'*/

/**
 * Sets the functional hooks for listening on the lifecycle of
 * a component i.e addition, insertion and removal.
 * The component is registered automatically when hooks are attached
 * or when it first appears in a {@link World world}.
 * @example
 * ```ts
 * //a component
 * class A {}
 *
 * function added(entity:Entity,world:World){
 *   console.log(`Entity {${entity}} with component A added`)
 * }
 *
 * function inserted(entity:Entity,world:World){
 *   console.log(`Component A inserted into entity {${entity}}` )
 * }
 *
 * function removed(entity:Entity,world:World){
 *   console.log(`Entity {${entity}} with component A removed`)
 * }
 *
 * const world = new World()
 * const hooks = new ComponentHooks(added,inserted,removed)
 *
 * world.setComponentHooks(A, hooks)
 * ```
 *
 */
export class ComponentHooks {

  /** @type {ComponentHook | null}*/
  add

  /** @type {ComponentHook | null}*/
  remove

  /** @type {ComponentHook | null}*/
  insert

  /**
   * @param {ComponentHook | null} add
   * @param {ComponentHook | null} remove
   * @param {ComponentHook | null} insert
   */
  constructor(add = null, remove = null, insert = null) {
    this.add = add
    this.remove = remove
    this.insert = insert
  }
}
