/**
 * @template {number} [T = number]
 */
export class IndexAllocator {

  /**
   * @private
   * @type {number}
   */
  nextid = 0

  /**
   * @private
   * @type {T[]}
   */
  recycled = []

  /**
   * @param {T} index 
   */
  recycle(index){
    this.recycled.push(index)
  }

  /**
   * @returns {T}
   */
  reserve(){
    const recycled = this.recycled.pop()
        
    if(recycled !== undefined) return recycled

    const index = this.nextid

    this.nextid += 1

    // SAFETY: T is not a concrete type but extends
    // number
    return /** @type {T}*/(index)
  }

  count(){
    return (this.nextid - 1)
  }
}