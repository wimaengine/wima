import { swapRemove } from '../utils/index.js'

/**
 * @template T
 */
class Node {

  /**
   * @type { Node<T>[] }
   */
  paths = []

  /**
   * @type { T }
   */
  value

  /**
   * @param {T} obj
   */
  constructor(obj) {
    this.value = obj
  }
}

/**
 * @template T
 */
export class Graph {

  /**
   * @private
   * @type { Node<T>[] }
   */
  nodes = []

  /**
   * @param { T } obj
   * @returns {number} The index of the node.
   */
  add(obj) {
    return this.nodes.push(new Node(obj)) - 1
  }

  /**
   * @param {number} index
   * @returns {T}
   */
  get(index) {
    return this.nodes[index].value
  }

  /**
   * @param {number} index
   */
  getNode(index) {
    return this.nodes[index]
  }

  /**
   * TODO - This index thing actually fucks up things,maybe use mappings
   * Or nodes should actually be the indices to an array of values,
   * connections an array of arrays - also indexed by nodes.
   * @param { number } index - The index of the node to remove.
   */
  remove(index) {
    const temp = this.nodes.pop()
    const node = this.nodes[index]

    if (!temp) return

    for (let i = 0; i < node.paths.length; i++) {

      // @ts-ignore
      this.disconnect(index, node.paths[i])
    }

    if (index !== this.nodes.length) this.nodes[index] = temp
  }
  size() {
    return this.nodes.length
  }

  /**
   * @param {Node<T>} node1
   * @param {Node<T>} node2
   */
  existsNode(node1, node2) {
    for (let i = 0; i < node1.paths.length; i++) if (node1.paths[i] === node2) return true

    return false
  }

  /**
   * @param { number } start - Index of the first node.
   * @param { number } end - Index of the second node.
   */
  exists(start, end) {
    const node1 = this.nodes[start]
    const node2 = this.nodes[end]

    return this.existsNode(node1, node2)
  }

  /**
   * @param {number} start
   * @param {number} end
   */
  connect(start, end) {
    const node1 = this.nodes[start]
    const node2 = this.nodes[end]

    if (this.existsNode(node1, node2) || start === end) return

    node1.paths.push(node2)
  }

  /**
   * @param { number } start - Index of the first node.
   * @param { number } end - Index of the second node.
   */
  biconnect(start, end) {
    this.connect(start, end)
    this.connect(end, start)
  }

  /**
   * @param { number } start - Index of the first node.
   * @param { number } end - Index of the second node.
   */
  disconnect(start, end) {
    const node1 = this.nodes[start]
    const node2 = this.nodes[end]

    if (!this.existsNode(node1, node2)) return

    swapRemove(node1.paths, node1.paths.indexOf(node2))
  }

  /**
   * @param { number } start - Index of the first node.
   * @param { number } end - Index of the second node.
   */
  bidisconnect(start, end) {
    this.disconnect(start, end)
    this.disconnect(end, start)
  }
}