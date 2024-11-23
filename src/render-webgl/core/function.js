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

/**
 * @param {WebGLRenderingContext} gl
 * @param {TexImageSource} img
 * @param {number} flipY
 */
export function createTexture(gl, img, flipY) {
  const tex = gl.createTexture()

  if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
  gl.generateMipmap(gl.TEXTURE_2D)

  if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)

  return tex
}