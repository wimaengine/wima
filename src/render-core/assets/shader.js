import { ShaderStage } from '../core/index.js'

export class Shader {

  /**
   * @readonly
   * @type {ShaderStage}
   */
  stage

  /**
   * @type {string}
   */
  source

  /**
   * @param {ShaderStage} stage
   * @param {string} source
   */
  constructor(stage, source){
    this.stage = stage
    this.source = source
  }
  static default(){
    return new Shader(ShaderStage.Fragment, '')
  }
}