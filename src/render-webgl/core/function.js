/** @import {TypeArray} from '../../utils/index.js'*/
import { assert } from '../../logger/index.js'
import { ShaderStage, MeshAttribute, Mesh } from '../../render-core/index.js'
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

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertex
 * @param {WebGLShader} fragment
 * @param {Readonly<Map<string,MeshAttribute>>} attributemap
 */
export function createProgram(gl, vertex, fragment, attributemap) {
  const program = gl.createProgram()

  assert(program, 'Could not create a program.')

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  attributemap.forEach((attribute) => {
    gl.bindAttribLocation(program, attribute.id, attribute.name)
  })
  gl.linkProgram(program)

  return program
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 */
export function validateProgram(gl, program) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(
      `Program could not be linked: 
      ${gl.getProgramInfoLog(program)}
      `
    )
  }

  gl.validateProgram(program)

  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.log(
      `Program could not be validated: 
       ${gl.getProgramInfoLog(program)}
        `
    )
  }
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {Mesh} mesh
 * @param {Map<string,MeshAttribute>} attributemap
 */
export function createVAO(gl, mesh, attributemap) {
  const vao = gl.createVertexArray()
  const indices = mesh.getIndices()
  const attributedata = mesh.getAttributes()

  gl.bindVertexArray(vao)

  if (indices !== undefined) {
    createBufferData(gl, BufferType.ElementArray, indices, DrawUsage.Static)
  }

  for (const [name, data] of attributedata) {
    const attribute = attributemap.get(name)

    assert(attribute, `The attribute "${name}" is not defined in the\`AttributeMap()\``)
    createBufferData(gl, BufferType.Array, data.data, DrawUsage.Static)

    gl.enableVertexAttribArray(attribute.id)
    gl.vertexAttribPointer(attribute.id, attribute.size, attribute.type, false, 0, 0)
  }

  return vao
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {string} vertex
 * @param {string} fragment
 * @param {Readonly<Map<string,MeshAttribute>>} attributemap
 */
export function createProgramFromSrc(gl, vertex, fragment, attributemap) {
  const v = createShader(gl, vertex, gl.VERTEX_SHADER)
  const f = createShader(gl, fragment, gl.FRAGMENT_SHADER)
  const program = createProgram(gl, v, f, attributemap)

  return program
}