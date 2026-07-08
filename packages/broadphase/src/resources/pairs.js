import { CollisionPair } from '../core'

/** @augments {Array<CollisionPair>} */
export class CollisionPairs extends Array {
  clear() {
    this.length = 0
  }
}
