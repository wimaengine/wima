import { CollisionPair } from '../core/index.js'

/** @augments {Array<CollisionPair>} */
export class CollisionPairs extends Array {
  clear(){
    this.length = 0
  }
}