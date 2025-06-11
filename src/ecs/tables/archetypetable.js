/** @import { ArchetypeId, ArchetypeFilter } from '../typedef/index.js'*/
/** @import { TypeId } from '../../reflect/index.js'*/

import { throws } from '../../logger/index.js'
import { swapRemove } from '../../utils/index.js'

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
   * @type {Map<TypeId,unknown[]>}
   */
  components = new Map()
}

/**
 * Store components in {@link Archetype archetypes}.
 */
export class ArchetypeTable {

  /**
   * @private
   * @type {Archetype[]}
   */
  list = []

  /**
   * @param {TypeId[]} comps
   * @returns {ArchetypeId}
   */
  createArchetype(comps) {
    const archetype = new Archetype()

    for (let i = 0; i < comps.length; i++) {
      archetype.components.set(comps[i], [])
    }

    return this.list.push(archetype) - 1
  }

  /**
   * @param {Archetype} archetype
   * @param {TypeId[]} comps
   * @returns {boolean} 
   */
  archetypeHasOnly(archetype, comps) {
    if (comps.length !== archetype.components.size) return false

    for (let i = 0; i < comps.length; i++) {
      if (!archetype.components.has(comps[i])) return false
    }

    return true
  }

  /**
   * @param {ArchetypeId} id
   * @returns {Archetype | undefined}
   */
  getArchetype(id) {
    return this.list[id]
  }

  /**
   * @param {ArchetypeFilter} filter
   * @param {Archetype[]} out
   * @returns {Archetype[]}
   */
  filterArchetypes(filter, out = []) {
    for (let i = 0; i < this.list.length; i++) {
      if (filter(this.list[i], i)) out.push(this.list[i])
    }

    return out
  }

  /**
   * @param {TypeId[]} comps
   * @returns {ArchetypeId}
   */
  getArchetypeId(comps) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.archetypeHasOnly(this.list[i], comps)) {
        return i
      }
    }

    return -1
  }

  /**
   * @param {TypeId[]} ids
   * @returns {ArchetypeId}
   */
  resolveArchetypeFor(ids) {
    for (let i = 0; i < this.list.length; i++) {
      const hasit = this.archetypeHasOnly(this.list[i], ids)

      if (hasit) return i
    }

    return this.createArchetype(ids)
  }

  /**
   * @param {TypeId[]} comps
   * @param {ArchetypeId[]} filtered
   * @returns {ArchetypeId[]}
   */
  getArchetypeIds(comps, filtered) {
    for (let i = 0; i < this.list.length; i++) {
      let hasComponents = true

      for (let j = 0; j < comps.length; j++) {
        if (!this.list[i].components.has(comps[j])) {
          hasComponents = false
          break
        }
      }

      if (hasComponents) filtered.push(i)
    }

    return filtered
  }

  /**
   * @template {unknown[]} T
   * @param {ArchetypeId} id
   * @param {TypeId[]} keys
   * @param {[...T]} components
   */
  insertIntoArchetype(id, keys, components) {
    const archetype = this.list[id]

    // SAFETY: Caller ensures the archetype has at least 1 component list
    const index = /** @type {number}*/(archetype.components.values().next().value?.length)

    for (let i = 0; i < components.length; i++) {
      const list = archetype.components.get(keys[i])

      if(list){
        list[index] = components[i]
      }else{
        throws('Invalid archetype insertion!')
      }
    }

    return index
  }

  /**
   * @param {ArchetypeId} id
   * @param {number} index
   * @returns {[TypeId[],unknown[]] | null}
   */
  extract(id, index) {
    const keys = []
    const components = []
    const archetype = this.list[id]

    if(!archetype) return null

    for (const [key, list] of archetype.components) {
      keys.push(key)
      components.push(list[index])
    }

    return [keys, components]
  }

  /**
   * @template {unknown[]} T
   * @param {[...T]} components
   * @param {TypeId[]} ids
   * @returns {[ArchetypeId,number]}
   */
  insert(components, ids) {
    const archid = this.resolveArchetypeFor(ids)
    const index = this.insertIntoArchetype(archid, ids, components)

    return [archid, index]
  }

  /**
   * @param {ArchetypeId} id
   * @param {number} index
   * @returns {void}
   */
  remove(id, index) {
    const archetype = this.list[id]

    for (const list of archetype.components.values()) {
      swapRemove(list, index)
    }
  }

  /**
   * @template T
   * @param {ArchetypeId} id
   * @param {number} index
   * @param {TypeId} compname
   * @returns {T | null}
   */
  get(id, index, compname) {
    const archetype = this.list[id]

    if (!archetype) return null

    const compList = archetype.components.get(compname)

    if (!compList) return null

    return /** @type {T}*/(compList[index])
  }

  /**
   * @returns {void}
   */
  clear() {
    this.list = []
  }
}