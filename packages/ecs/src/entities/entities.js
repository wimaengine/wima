/** @import { ArchetypeId, TableRow } from '../typedef' */
import { DenseList, IndexAllocator } from '@wimaengine/datastructures'
import { EntityLocation } from './location'

/** @augments {DenseList<EntityLocation>} */
export class Entities extends DenseList {
  constructor() {
    super(new IndexAllocator())
  }
}
