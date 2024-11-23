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

/**
 * @param {WebGLRenderingContext} gl
 * @param {BufferType} type
 * @param {TypeArray} data
 * @param {DrawUsage} bufferUsage
 * @returns {WebGLBuffer}
 */
export function createBufferData(gl, type, data, bufferUsage) {
  const buffer = gl.createBuffer()

  assert(buffer, 'Buffer could not be created.')
  gl.bindBuffer(type, buffer)
  gl.bufferData(type, data, bufferUsage)

  return buffer
}