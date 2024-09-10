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
}