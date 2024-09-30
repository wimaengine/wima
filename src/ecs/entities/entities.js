import { DenseList } from '../../datastructures/index.js'
import { EntityLocation } from './location.js'

/** @augments {DenseList<EntityLocation>} */
export class Entities extends DenseList {
  reserve(){
    return this.push(new EntityLocation(-1, -1))
  }
}