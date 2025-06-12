import { UBOCache } from '../resources/index.js'
import { assert } from '../../logger/index.js'
import {
  Vector2,
  Vector3,
  Vector4,
  Matrix2,
  Matrix3,
  Matrix4,
  Matrix2x3,
  Matrix3x4
} from '../../math/index.js'

export class WebglRenderPipeline {

  /**
   * @readonly
   */
  program

  /**
   * @private
   */
  uniforms = new Map()

  // This seems very irrelevant?
  /**
   * @private
   */
  uniformBuffers = new Map()

  /**
   * @param {WebGLProgram} program
   */
  constructor(program) {
    this.program = program
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {UBOCache} ubos
   * @throws {string}
   */
  init(gl, ubos) {
    const uniformNum = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)

    for (let i = 0; i < uniformNum; i++) {
      const info = gl.getActiveUniform(this.program, i)

      if(!info)continue

      const location = gl.getUniformLocation(this.program, info.name)

      if (location === null) continue

      this.uniforms.set(info.name, {
        type: info.type,
        size: info.size,
        location
      })
    }

    const uniformBufNum = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORM_BLOCKS)

    for (let i = 0; i < uniformBufNum; i++) {
      const name = gl.getActiveUniformBlockName(this.program, i)
      const indices = gl.getActiveUniformBlockParameter(this.program, i, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES)
      const offsets = gl.getActiveUniforms(this.program, indices, gl.UNIFORM_OFFSET)
      const size = gl.getActiveUniformBlockParameter(this.program, i, gl.UNIFORM_BLOCK_DATA_SIZE)
      
      if(!name)continue
      
      const ubo = ubos.get(name)

      this.uniformBuffers.set(name, {
        index: i,
        offsets,
        size
      })

      assert(ubo, `The uniform block '${name}' is not registered in \`UBOCache\`.`)

      if (ubo.size !== +size) throw `The uniform block '${name}' should be of size of ${size} but is size of ${ubo.size}.`

      gl.uniformBlockBinding(this.program, i, ubo.point)
    }
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {number} value
   */
  setUniformFloat(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform1f(uniform.location, value)
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {number} value
   */
  setUniformInt(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform1i(uniform.location, value)
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {number} value
   */
  setUniformUint(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform1ui(uniform.location, value)
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Vector2} value
   */
  setUniformVector2(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform2f(uniform.location, value.x, value.y)
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Vector3} value
   */
  setUniformVector3(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return
    
    gl.uniform3f(uniform.location, value.x, value.y, value.z)
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Vector4} value
   */
  setUniformVector4(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniform4f(uniform.location, value.x, value.y, value.z, value.w)
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Matrix2} value
   */
  setUniformMatrix2(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix2fv(uniform.location, true, new Float32Array([...value]))
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Matrix3} value
   */
  setUniformMatrix3(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix3fv(uniform.location, true, new Float32Array([...value]))
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Matrix4} value
   */
  setUniformMatrix4(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix4fv(uniform.location, true, new Float32Array([...value]))
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Matrix2x3} value
   */
  setUniformMatrix2x3(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix2x3fv(uniform.location, true, new Float32Array([...value]))
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {string} name
   * @param {Matrix3x4} value
   */
  setUniformMatrix3x4(gl, name, value) {
    const uniform = this.uniforms.get(name)

    if (!uniform) return

    gl.uniformMatrix3x4fv(uniform.location, true, new Float32Array([...value]))
  }
}