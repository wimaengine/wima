import { createBuffer } from '../core/index.js'

export class UBOCache {

  /**
   * @private
   * @type {Map<string,UBO>}
   */
  object = new Map()

  /**
   * @private
   * @type {number}
   */
  pointGenerator = 0

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {number} size
   */
  create(gl, name, size) {
    const buffer = createBuffer(gl, gl.UNIFORM_BUFFER, size, gl.DYNAMIC_DRAW)

    gl.bindBufferBase(gl.UNIFORM_BUFFER, this.pointGenerator, buffer)
    this.object.set(name, new UBO(
      this.pointGenerator,
      buffer,
      size
    ))
    this.pointGenerator += 1
  }

  /**
   * @param {string} name
   * @returns {UBO | undefined}
   */
  get(name) {
    return this.object.get(name)
  }
}

class UBO {

  /**
   * @readonly
   * @type {number}
   */
  point

  /**
   * @readonly
   * @type {WebGLBuffer}
   */
  buffer

  /**
   * @readonly
   * @type {number}
   */
  size

  /**
   * @param {number} point
   * @param {WebGLBuffer} buffer
   * @param {number} size
   */
  constructor(point, buffer, size) {
    this.point = point
    this.buffer = buffer
    this.size = size
  }
}