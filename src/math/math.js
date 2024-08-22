import { DEG2RAD, RAD2DEG } from './constants.js'

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

/**
 * Returns the square of a number.
 *
 * @param {number} x - The number to square.
 * @returns {number}
 */
export function sq(x) {
  return x * x
}

/**
 * Returns the power of a number by a given exponent.
 *
 * @param {number} x - The number to power.
 * @param {number} [e=2] - The number to power by.
 * @returns {number}
 */
export function exp(x, e = 2) {
  return x ** e
}

/**
 * Returns the square root pf a number.
 *
 * @param {number} x - The number to root.
 * @returns {number}
 */
export function sqrt(x) {
  return Math.sqrt(x)
}


/**
 * Interpolates between two numbers by a constant t.
 *
 * @param {number} a - The minimal bound of the interpolation.
 * @param {number} b - The maximum bound of the interpolation.
 * @param {number} t - A number between 0 and 1 to interpopate by.Any other number greater than 1 or less than 0 will extapolate beyond b or a respectively.
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + t * (b - a)
}

/**
 * Rounds a given value to a given precision.
 *
 * @param {number} number - The number to round.
 * @param {number} [precision=4] - How many decimal places there should be.
 * @returns {number}
 */
export function round(number, precision = 4) {
  const x = 10 ** precision

  return Math.round(number * x) / x
}

/**
 * Clamps a value between two numbers.
 *
 * @param {number} value - The number to clamp.
 * @param {number} min - The minimal bound of the clamped number.
 * @param {number} max - The maximum bound of the clamped number.
 * @returns {number}
 */
export function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max

  return value
}

/**
 * Maps a value from one range to another.
 *
 * @param {number} v
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function map(v, x1, y1, x2, y2) {
  return x2 + v * (y2 - x2) / (y1 - x1)
}

/**
 * Returns a unique number given from a pair of numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function naturalizePair(a, b) {
  if (a > b) return (a + b) * (a + b + 1) / 2 + a

  return (a + b) * (a + b + 1) / 2 + b
}

/**
 * Converts a degree to a radian.
 *
 * @param {number} deg - Number to convert.
 * @returns {number}
 */
export function degToRad(deg) {
  return deg * DEG2RAD
}

/**
 * Converts a radian to a degree.
 *
 * @param {number} rad - Number to convert.
 * @returns {number}
 */
export function radToDeg(rad) {
  return rad * RAD2DEG
}

/**
 * @param {number} x
 */
export function wrapAngle(x) {
  let a = x

  while (a > Math.PI * 2) {
    a = a - Math.PI * 2
  }
  while (a < 0) {
    a = a + Math.PI * 2
  }

  return a
}

/**
 * @param {number} v
 * @param {number} max
 */
export function wrap(v, max) {
  return v % max
}