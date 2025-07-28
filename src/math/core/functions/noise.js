/**
 * Creates a random number between the parameters.
 *
 * @param {number} [min=0] - The minimal bound of the random number.
 * @param {number} [max=1] - The maximum bound of the random number.
 * @returns {number}
 */
export function rand(min = 0, max = 1) {
  return Math.random() * (max - min) + min
}