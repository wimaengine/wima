/** @import {NodeId} from '../../datastructures/index.js' */
import { GraphList } from '../../datastructures/index.js'

export class AudioGraph {

  /**
   * @private
   * @type {AudioContext}
   */
  context

  /**
   * @type {GraphList<AudioNode,undefined>}
   */
  graph = new GraphList()

  /**
   * @private
   * @type {NodeId}
   */
  root

  /**
   * @param {AudioContextOptions} [options]
   */
  constructor(options) {
    const context = new AudioContext(options)
    const rootid = this.add(context.destination)
    
    this.context = context
    this.root = rootid
    addEventListener('pointerdown', resumeAudio)
    
    /**
     *
     */
    function resumeAudio() {
      const ctx = context

      ctx.resume()
      
      if (ctx.state === 'running') {
        removeEventListener('pointerdown', resumeAudio)
      }
    }
  }
  getRoot() {
    return this.root
  }
  getContext() {
    return this.context
  }
  
  /**
   * @param {AudioNode} node
   */
  add(node) {
    return this.graph.addNode(node)
  }

  /**
   * @param {NodeId} from
   * @param {NodeId} to
   */
  connect(from, to) {
    const node1 = this.graph.getNodeWeight(from)
    const node2 = this.graph.getNodeWeight(to)
    
    if (node1 && node2) {
      this.graph.addEdge(from, to)
      node1.connect(node2)
    }
  }

  /*
   *
  disconnect(from, to) {
    const node1 = this.graph.getNodeWeight(from)
    const node2 = this.graph.getNodeWeight(to).
   
    if (node1 && node2) {
      this.graph.removeEdge(from, to)
      node1.disconnect(node2)
    }.
  }.
   
  remove(id) {}
   */
}