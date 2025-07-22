import { DEG2RAD, RAD2DEG, epilson } from "../constants.js"

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
 * @param {number} value
 */
export function invert(value) {
    return 1 / value
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
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function wrap(value, min, max) {
    const range = max - min

    return (min + ((((value - min) % range) + range) % range))
}

/**
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function cantorPair(a, b) {
    return 0.5 * (a + b) * (a + b + 1) + b

}

/**
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function cantorPairSigned(a, b) {
    const x = (a >= 0.0 ? 2.0 * a : (-2.0 * a) - 1.0)
    const y = (b >= 0.0 ? 2.0 * b : (-2.0 * b) - 1.0)

    return cantorPair(x, y)
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} tolerance
 */
export function fuzzyEqual(a, b, tolerance = epilson) {
    return Math.abs(a - b) <= tolerance
}