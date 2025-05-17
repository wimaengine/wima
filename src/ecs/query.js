/** @import { ArchetypeId } from './typedef/index.js'*/
/** @import { Constructor, TypeId } from '../reflect/index.js'*/

import { Entity } from './entities/index.js'
import { World } from './registry.js'
import { ArchetypeTable } from './tables/archetypetable.js'
import { typeid } from '../reflect/index.js'

/**
 * Enables operations to be performed on specified set 
 * of components components on a {@link World}.
 * Ensure that the component types matches up with the 
 * component names given in the second parameter of 
 * the query in lower case.
 * @example
 * ```ts
 * class A {}
 * class B {}
 * 
 * const world = new World()
 *   .registerType(A)
 *   .registerType(B)
 * const query = new Query<[A, B]>(world, ['a','b'])
 * 
 * // you can now use the query to perform operations
 * // on entities with components `A` and `B`
 * // see the {@link Query} methods to know what operations 
 * // are available
 * ```
 * 
 * @template {unknown[]} T
 */
export class Query {

  /**
   * @private
   * @type {World}
   */
  registry

  /**
   * @readonly
   * @type {TypeId[]}
   */
  descriptors = []

  /**
   * @private
   * @type {any[][]}
   */
  components = []

  /**
   * @private
   * @type {Map<ArchetypeId,number>}
   */
  archmapper = new Map()

  /**
   * @param {World} registry
   * @param {[...TupleConstructor<T>]} componentTypes
   */
  constructor(registry, componentTypes) {
    this.registry = registry
    this.descriptors = componentTypes.map((c) => typeid(c))

    for (let i = 0; i < componentTypes.length; i++) {
      this.components[i] = []
    }

    this.update(registry.getTable())
  }

  /**
   * @param {ArchetypeTable} table
   */
  update(table) {
    const { descriptors, components } = this
    const archids = table.getArchetypeIds(descriptors, [])
    
    for (let i = 0; i < archids.length; i++) {
      this.archmapper.set(archids[i], i)
    }

    // This will help implement query filters
    // const archetypes = table.filterArchetypes((archetype)=>true)
    for (let i = 0; i < descriptors.length; i++) {
      for (let j = 0; j < archids.length; j++) {

        // instead of keeping the component lists,keep the verified archetype
        // as their ids to get them later
        const bin = table.getArchetype(archids[j]).components.get(descriptors[i])

        components[i].push(bin)
      }
    }
  }

  /**
   * Gets the components of a given entity.
   * 
   * @param {Entity} entity
   * @returns {T | null}
   */
  get(entity) {
    const entities = this.registry.getEntities()
    const location = entities.get(entity.index)

    if(!location) return null

    const { archid, index } = location
    const tableid = this.archmapper.get(
      archid
    )

    if (tableid === undefined) return null

    const components = new Array(this.descriptors.length)

    for (let i = 0; i < this.descriptors.length; i++) {
      components[i] = this.components[i][tableid][index]
    }

    // SAFETY: Components are fetched in same order and types as the generic.
    return /** @type {T}*/(components)
  }
  
  /**
   * @param {EachFunc<T>} callback
   */
  each(callback) {
    const components = new Array(this.descriptors.length)

    if (!this.components[0]) return

    for (let j = 0; j < this.components[0].length; j++) {
      for (let k = 0; k < this.components[0][j].length; k++) {
        for (let l = 0; l < this.descriptors.length; l++) {
          components[l] = this.components[l][j][k]
        }

        // @ts-ignore
        // SAFETY: Components are type cast to the expected passed value
        callback(components)
      }
    }
  }

  /**
   * @param {EachCombinationFunc<T>} callback
   */
  eachCombination(callback) {
    const components1 = new Array(this.descriptors.length)
    const components2 = new Array(this.descriptors.length)

    if (!this.components[0]) return

    // This... many people will be very upset.
    for (let j = 0; j < this.components[0].length; j++) {
      for (let k = 0; k < this.components[0][j].length; k++) {
        for (let l = j; l < this.components[0].length; l++) {
          const nextup = l === j ? k + 1 : 0

          for (let m = nextup; m < this.components[0][l].length; m++) {

            for (let n = 0; n < this.descriptors.length; n++) {
              components1[n] = this.components[n][j][k]
              components2[n] = this.components[n][l][m]
            }

            // @ts-ignore
            // SAFETY: Components are type cast to the expected passed value
            callback(components1, components2)
          }
        }
      }
    }
  }

  /**
   * @returns {T | null}
   */
  single() {
    const components = new Array(this.descriptors.length)

    if (!this.components[0] || !this.components[0][0] || this.components[0][0][0] === undefined) return null

    for (let i = 0; i < this.descriptors.length; i++) {
      components[i] = this.components[i][0][0]
    }

    // @ts-ignore
    // SAFETY: Components are type cast to the expected return value
    return components
  }

  /**
   * Returns the number of entities on this query.
   *
   * @returns {number}
   */
  count() {
    let sum = 0

    if (!this.components[0]) return 0

    for (let i = 0; i < this.components[0].length; i++) {
      sum += this.components[0][i].length
    }

    return sum
  }
}

/**
 * @template {unknown[]} T
 * @callback EachFunc
 * @param {[...T]} components
 * @returns {void}
 */

/**
 * @template {unknown[]} T
 * @callback EachCombinationFunc
 * @param {[...T]} components1
 * @param {[...T]} components2
 * @returns {void}
 */

/**
 * @template {unknown[]} T
 * @typedef {{[K in keyof T]:Constructor<T[K]>}} TupleConstructor
 */