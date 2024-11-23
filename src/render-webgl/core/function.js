/** @import {TypeArray} from '../../utils/index'*/
import { assert } from '../../logger/index.js'
import { ShaderStage } from '../../render-core/index.js'
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

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} src
 * @param {ShaderStage} type
 * @returns {WebGLShader}
 */
export function createShader(gl, src, type) {
  const shader = gl.createShader(type)
  
  assert(shader, 'Shader could not be created.')
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  return shader
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} shader
 * @param {string} label
 */
export function validateShader(gl, shader, label = '') {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      `Shader "${label}" could not compile:
      ${gl.getShaderInfoLog(shader)}`
    )

    return false
  }

  return true
}