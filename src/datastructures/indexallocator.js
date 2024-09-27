export class IndexAllocator {

    /**
     * @private
     * @type {number}
     */
    nextid = 0

    /**
     * @private
     * @type {number[]}
     */
    recycled = []

    /**
     * @param {number} index 
     */
    recycle(index){
        this.recycled.push(index)
    }

    /**
     * @returns {number}
     */
    reserve(){
        const recycled = this.recycled.pop()
        
        if(recycled !== undefined) return recycled

        const index = this.nextid

        this.nextid += 1

        return index
    }
    count(){
        return (this.nextid - 1)
    }
}