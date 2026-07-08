import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { Children, Parent } from './components'
import { addSelfToChildren, despawnChildren, addSelfToParent, removeSelfFromParent } from './hooks'
import { registerHierarchyTypes } from './systems'

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
      .registerSystem({ schedule: AppSchedule.Startup, system: registerHierarchyTypes })
  }
}
