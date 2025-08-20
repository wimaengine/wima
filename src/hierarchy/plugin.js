import { App, Plugin } from '../app/index.js'
import { ComponentHooks } from '../ecs/index.js'
import { Children, Parent } from './components/index.js'
import { addSelfToChildren, despawnChildren, addSelfToParent, removeSelfFromParent } from './hooks/index.js'

export class HierarchyPlugin extends Plugin {

  /**
   * @param {App} app 
   */
  register(app) {
    app
      .registerType(Children)
      .setComponentHooks(Children, new ComponentHooks(
        addSelfToChildren,
        despawnChildren,
        null
      ))
      .registerType(Parent)
      .setComponentHooks(Parent, new ComponentHooks(
        addSelfToParent,
        removeSelfFromParent,
        null
      ))
  }
}