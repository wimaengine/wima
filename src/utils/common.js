let tmpID = 0
 
/**
 * Generates a unique id starting from 0 when called.
 *
 * @returns {number}
 */
export function generateIDBasic() {
  return (tmpID += 1)
}

/**
 * Removes an element by its index from an array by 
 * swapping it with the last element and popping it
 * off the array.
 * Use this when order of elements in the array do 
 * not matter.
 *
 * @template T
 * @param {T[]} arr
 * @param {number} index
 * @returns {void}
 */
export function swapRemove(arr, index) {
  if (index === -1) return
  if (arr.length - 1 === index){
     arr.pop()
     
     return
    }

  const temp2 = arr.pop()

  if(!temp2)return

  arr[index] = temp2

  return
}

/**
 * Performs no operations on any given input.
 * Used as a callback function where no operaion
 * is required.
 * 
 * @template {Tuple} T
 * @param {T} _args
 */
export function noop(..._args){}

/**
 * Represents the dimension.
 * 
 * @readonly
 * @enum {number}
 */
export const Dimension = {
  Both:0,
  Two:1,
  Three:2
}