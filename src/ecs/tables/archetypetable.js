/** @import { ComponentId, ArchetypeId, ArchetypeFilter, Tuple } from '../typedef/index.js'*/
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

/**
 * Store components in {@link Archetype Archetypes}.
 */
export class ArchetypeTable {

  /**
   * @private
   * @type {Archetype[]}
   */
  list = []

  /**
   * @param {ComponentId[]} comps
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
   * @param {ComponentId[]} comps
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
   * @returns {Archetype}
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
   * @param {ComponentId[]} comps
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
   * @param {ComponentId[]} ids
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
   * @param {ComponentId[]} comps
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
   * @param {ComponentId[]} keys
   * @param {[...T]} components
   */
  insertIntoArchetype(id, keys, components) {
    const archetype = this.list[id]

    // @ts-ignore
    // SAFETY: `entity` is always at index 0 of component list
    const index = archetype.components.get(0).length

    for (let i = 0; i < components.length; i++) {

      // @ts-ignore
      // SAFETY: calling function ensures there is component list for each shown
      archetype.components.get(keys[i])[index] = components[i]
    }

    return index
  }

  /**
   * @param {ArchetypeId} id
   * @param {number} index
   * @returns {[ComponentId[],Tuple]}
   */
  extract(id, index) {
    const keys = []
    const components = []
    const archetype = this.list[id]

    assert(archetype, 'Tried to extract from a non existent archetype.')

    for (const [key, list] of archetype.components) {
      keys.push(key)
      components.push(list[index])
    }

    return [keys, components]
  }

  /**
   * @template {Tuple} T
   * @param {T} components
   * @param {ComponentId[]} ids
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
   * @param {ComponentId} compname
   * @returns {T | null}
   */
  get(id, index, compname) {
    const archetype = this.list[id]

    if (!archetype) return null

    const compList = archetype.components.get(compname)

    if (!compList) return null

    return compList[index]
  }

  /**
   * @returns {void}
   */
  clear() {
    this.list = []
  }
}