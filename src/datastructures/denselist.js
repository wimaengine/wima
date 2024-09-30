import { assert } from '../logger/index.js'
import { IndexAllocator } from './indexallocator.js'

/**
 * @template T
 */
export class DenseList {

  /**
   * @private
   * @type {T[]}
   */
  list = []

  /**
   * @private
   * @type {IndexAllocator}
   */
  allocator = new IndexAllocator()

  /**
   * @param {T} object 
   * @returns {number}
   */
  push(object){
    const index = this.allocator.reserve()

    this.list[index] = object

    return index
  }

  /**
   * @param {number} index
   */
  recycle(index){
    this.allocator.recycle(index)
  }
    
  /**
   * @param {number} index 
   * @returns {T | undefined}
   */
  get(index){
    return this.list[index]
  }

  /**
   * @param {number} index 
   * @param {T} object 
   */
  set(index, object){
    assert(index <= this.allocator.count(), 'The index provided has never been allocated' )
    this.list[index] = object    
  }

  /**
   * @returns {number}
   */
  reserve(){
    return this.allocator.reserve()
  }
}