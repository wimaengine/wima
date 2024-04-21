/** @import { ComponentHook } from '../typedef/index.js'*/

/**
 * Sets the functional hooks for listening on the lifecycle of
 *  a component i.e addition, insertion and removal.
 * The component needs to be {@link World.registerType registered}
 *  on a {@link World world} before its hooks can be set.
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
 * world
 *   .registerType(A)
 *   .setComponentHooks(A,hooks)
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