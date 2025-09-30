/** @import { ArchetypeId, TableRow } from '../typedef/index.js' */
import { DenseList } from '../../datastructures/index.js'
import { EntityLocation } from './location.js'

/** @augments {DenseList<EntityLocation>} */
export class Entities extends DenseList {}