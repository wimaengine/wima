/**
 * @param {number} value
 * @returns {number}
 */
export function smoothStep(value) {
    return value * value * (3 - 2 * value)
};

/**
 * @param {number} value
 */
export function smootherStep(value) {
    return value * value * value * (value * (value * 6 - 15) + 10)
}