import { swapRemove } from '../../utils/index.js'
import { assert } from '../../logger/index.js'

/**
 * Contains entities with the same set of components.
 * @example
 * ```ts
 * //components
 * class A {}
 * class B {}
 * 
 * //This archetype contains entities with component A
 * const archetype1 = new Archetype()
 * archetype.components.set("A",[])
 * 
 * //This archetype contains entities with component A and B
 * const archetype2 = new Archetype()
 * archetype.components.set("A",[])
 * archetype.components.set("B",[])
 * ```
 */
export class Archetype {

  /**
   * @type {Map<ComponentId,any[]>}
   */
  components = new Map()
}