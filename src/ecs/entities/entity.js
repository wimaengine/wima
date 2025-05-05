export class Entity {
    /**
     * @type {number}
     */
    index
    /**
     * @param {number} index
     */
    constructor(index){
        this.index = index
    }
    /**
     * @param {Entity} other
     */
    equals(other){
        return this.index == other.index
    }
}