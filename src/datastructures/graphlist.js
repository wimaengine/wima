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

/**
 * @template T
 */
export class GraphEdge {

  /**
   * @type {number}
   */
  to

  /**
   * @type {number}
   */
  from

  /**
   * @type {[EdgeId | undefined, EdgeId | undefined]}
   */
  next = [undefined, undefined]

  /**
   * @type {T}
   */
  weight

  /**
   * @param {number} from
   * @param {number} to
   * @param {T} weight 
   */
  constructor(from, to, weight) {
    this.from = from
    this.to = to
    this.next = [undefined, undefined]
    this.weight = weight
  }
}