/** @import {ArchetypeId} from '../typedef/index.js' */

export class EntityLocation {

  /**
   * @param {ArchetypeId} archid
   * @param {number} index 
   */
  constructor(archid, index) {
    this.archid = archid
    this.index = index
  }
}