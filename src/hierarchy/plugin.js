import { App } from '../app/index.js'
import { Children, Parent } from './components/index.js'

export class HierarchyPlugin {

  /**
   * @param {App} app 
   */
  register(app) {
    app
      .registerType(Children)
      .registerType(Parent)
  }
}