import { Vector2, Vector3 } from "../vectors/index.js"

/**
 * @param {number} value 
 * @param {number} width 
 * @returns {Vector2}
 */
export function mapToIndex2D(value, width) {
    return new Vector2(value % width, Math.floor(value / width))
}

/**
 * @param {number} index
 * @param {number} width
 * @param {number} height
 * @returns {Vector3}
 */
export function mapToIndex3D(index, width, height) {
    const depthMax = width * height
    const rem = index % depthMax
    const z = Math.floor(index / depthMax)
    const y = Math.floor(rem / width)
    const x = rem % width

    return new Vector3(x, y, z)
}