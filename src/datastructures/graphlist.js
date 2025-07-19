/**
 * @template T
 */
export class GraphNode {

  /**
   * @type {[EdgeId | undefined, EdgeId | undefined]}
   */
  next = [undefined, undefined]

  /**
   * @type {T}
   */
  weight

  /**
   * @param {T} weight
   */
  constructor(weight) {
    this.weight = weight
  }
}