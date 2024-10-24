import { App } from '../app/index.js'
import { Session, Storage, Cookies } from './resources/index.js'

export class StoragePlugin {

  /**
   * @param {App} app 
   */
  register(app) {
    app
      .setResource(new Session())
      .setResource(new Storage())
      .setResource(new Cookies())
  }
}