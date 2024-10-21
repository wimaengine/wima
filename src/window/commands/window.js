/** @import { Entity } from '../../ecs/index.js' */
import { Command } from '../../command/index.js'
import { WindowRequest } from '../core/index.js'

export class WindowCommand extends Command{

  /**
   * @readonly
   * @type {Entity}
   */
  entity

  /**
   * @readonly
   * @type {WindowRequest}
   */
  type

  /**
   * @readonly
   * @type {any}
   */
  data

  /**
   * @param {Entity} entity
   * @param {WindowRequest} type
   * @param {any} data
   */
  constructor(entity, type, data){
    super()
    this.entity = entity
    this.type = type
    this.data = data
  }
}