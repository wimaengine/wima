/**
 * @template T
 * @param {T[]} arr - The array to sort.
 * @param {CompareFunc} [compareFunc] - Makes comparisons on the elements on the array.Default is to return true if the lhs is less than rhs.
 * @param {SwapFunc<T>} [swapFunc] - Function to swap the elements in the array.
 * @param {number} [min=0]
 * @param {number} [max=arr.length]
 */
export function quickSort(arr, compareFunc = defaultCompare, swapFunc = defaultSwap, min = 0, max = arr.length - 1) {
  if (min < max) {
    let i = min - 1

    for (let j = min; j < max; j++) {
      if (compareFunc(j, max)) {
        i += 1
        swapFunc(arr, i, j)
      }
    }

    swapFunc(arr, i + 1, max)
    quickSort(arr, compareFunc, swapFunc, min, i)
    quickSort(arr, compareFunc, swapFunc, i + 2, max)
  }
}

/**
 * @type {CompareFunc}
 */
function defaultCompare(i, j) {
  return i < j
}

/**
 * @type {SwapFunc<any>}
 */
function defaultSwap(arr, i, j) {
  const temp = arr[i]

  arr[i] = arr[j]
  arr[j] = temp
}

/**
 * @callback CompareFunc
 * @param {number} i
 * @param {number} j
 * @returns {boolean}
 */

/**
 * @template T
 * @callback SwapFunc
 * @param {T[]} arr
 * @param {number} i
 * @param {number} j
 * @returns {void}
 */