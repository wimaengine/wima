/** @import { SystemFunc } from '../../ecs/index.js'*/

export class Demo {

  /**
   * @readonly
   * @type {string}
   */
  name

  /**
   * @readonly
   * @type {SystemFunc[]}
   */
  init

  /**
   * @readonly
   * @type {SystemFunc[]}
   */
  update
  
  /**
   * @param {string} name 
   * @param {SystemFunc[]} init
   * @param {SystemFunc[]} update
   */
  constructor(name, init = [], update = []){
    this.name = name
    this.init = init
    this.update = update
  }
}