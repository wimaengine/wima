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

/**
 * @template [T = unknown]
 * @template [U = unknown]
 */
export class GraphList {

  /**
   * @private
   * @type {GraphNode<T>[]}
   */
  nodes = []

  /**
   * @private
   * @type {GraphEdge<U>[]}
   */
  edges = []

  /**
   * @readonly
   * @type {boolean}
   */
  directed

  /**
   * @param {boolean} [directed]
   */
  constructor(directed) {
    this.directed = directed
  }

  /**
   * @param {T} weight
   * @returns {NodeId}
   */
  addNode(weight) {
    const node = new GraphNode(weight)
    const id = this.nodes.length

    this.nodes.push(node)

    return id
  }

  /**
   * @param {NodeId} from
   * @param {NodeId} to
   * @param {U} weight
   * @returns {EdgeId}
   */
  addEdge(from, to, weight) {
    const id = this.edges.length
    const edge = new GraphEdge(from, to, weight)

    this.edges.push(edge)
    const nodeA = this.nodes[from]
    const nodeB = this.nodes[to]

    edge.next[0] = nodeA.next[0]
    edge.next[1] = nodeB.next[1]
    nodeA.next[0] = id
    nodeB.next[1] = id

    return id
  }

  /**
   * @param {NodeId} id
   * @returns {GraphNode<T> | undefined}
   */
  getNode(id) {
    return this.nodes[id]
  }

  /**
   * @param {EdgeId} id
   * @returns {GraphEdge<U> | undefined}
   */
  getEdge(id) {
    return this.edges[id]
  }

  /**
   * @param {NodeId} id
   */
  getNodeWeight(id) {
    const node = this.getNode(id)

    if (!node) return undefined

    return node.weight
  }

  /**
   * @param {EdgeId} id
   */
  getEdgeWeight(id) {
    const edge = this.getEdge(id)

    if (!edge) return undefined

    return edge.weight
  }

  /**
   * @param {NodeId} id
   */
  getNeighbours(id) {
    return new GraphNeighbourIterator(this, id)
  }

  /**
   * @param {NodeId} id
   */
  getNodeEdges(id) {
    return new GraphNodeEdgesIterator(this, id)
  }
  getEdges() {
    return this.edges
  }
  getNodes() {
    return this.nodes
  }

  getNodeCount() {
    return this.nodes.length
  }

  getEdgeCount() {
    return this.edges.length
  }
}