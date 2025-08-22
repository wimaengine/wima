import { App } from '../../dist/index.module.js'
import { Name } from './components/index.js'

export class NamePlugin {
  /**
   * @param {App} app
   */
  register(app){
    app.registerType(Name)
  }
}