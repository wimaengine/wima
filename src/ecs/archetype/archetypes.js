/** @import { TypeId } from '../../reflect/index.js' */
/** @import { ArchetypeId } from '../typedef/index.js' */
import { Archetype } from './archetype.js'

export class Archetypes {

  /**
   * @private
   * @type {Archetype[]}
   */
  archetypes = []

  /**
   * @param {TypeId[]} types
   * @returns {boolean}
   */
  has(types) {
    for (let i = 0; i < this.archetypes.length; i++) {
      if (this.archetypes[i].has(types)) return true
    }

    return false
  }

  /**
   * @param {ArchetypeId} id
   * @returns {Archetype}
   */
  get(id) {
    return this.archetypes[id]
  }

  /**
   * @param {Archetype} archetype
   * @returns {ArchetypeId}
   */
  set(archetype) {
    const id = this.archetypes.length

    this.archetypes.push(archetype)

    // SAFETY: This class is the one allocating ids.
    return /** @type {ArchetypeId}*/ (id)
  }

  size() {
    return this.archetypes.length
  }

  /**
   * @returns {readonly Archetype[]}
   */
  values() {
    return this.archetypes
  }

  /**
   * @param { TypeId[] } typeIds
   * @returns { [ArchetypeId,Archetype] | undefined }
   */
  getArchetypeWithOnly(typeIds) {
    for (let i = 0; i < this.archetypes.length; i++) {
      const archetype = this.archetypes[i]

      if (archetype.hasOnly(typeIds)) {

        // SAFETY: This class is the one allocating ids.
        const id = /** @type {ArchetypeId} */ (i)

        return [id, archetype]
      }
    }

    return undefined
  }
}
