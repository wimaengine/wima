import { App, Plugin } from '../app/index.js'
import { Name } from './components/index.js'

export class NamePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app){
    app.registerType(Name)
  }
}