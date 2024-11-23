/** @import {TypeArray} from '../../utils/index'*/
import { assert } from '../../logger/index.js'
import { DrawUsage, BufferType } from './constants/index.js'

/**
 * @param {WebGLRenderingContext} gl
 * @param {BufferType} type
 * @param {number} size
 * @param {DrawUsage} bufferUsage
 * @returns {WebGLBuffer}
 */
export function createBuffer(gl, type, size, bufferUsage) {
  const buffer = gl.createBuffer()

  assert(buffer, 'Buffer could not be created.')
  gl.bindBuffer(type, buffer)
  gl.bufferData(type, size, bufferUsage)

  return buffer
}