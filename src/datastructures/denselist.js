import { assert } from '../logger/index.js'
import { IndexAllocator } from './indexallocator.js'

/**
 * @template T
 * @template {number} [I = number]
 */
export class DenseList {

  /**
   * @private
   * @type {T[]}
   */
  list = []

  /**
   * @private
   * @type {IndexAllocator<I>}
   */
  allocator = new IndexAllocator()

  /**
   * @param {T} object 
   * @returns {I}
   */
  push(object){
    const index = this.allocator.reserve()

    this.list[index] = object

    return index
  }

  /**
   * @param {I} index
   */
  recycle(index){
    this.allocator.recycle(index)
  }
    
  /**
   * @param {I} index 
   * @returns {T | undefined}
   */
  get(index){
    return this.list[index]
  }

  /**
   * @param {I} index 
   * @param {T} object 
   */
  set(index, object){
    assert(index <= this.allocator.count(), 'The index provided has never been allocated' )
    this.list[index] = object    
  }

  /**
   * @returns {I}
   */
  reserve(){
    return this.allocator.reserve()
  }
}