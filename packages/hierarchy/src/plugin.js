import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Children, Parent } from './components'
import { addSelfToChildren, despawnChildren, addSelfToParent, removeSelfFromParent } from './hooks'
import { registerHierarchyTypes } from './systems'

export class HierarchyPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(Children, new ComponentHooks(
        addSelfToChildren,
        despawnChildren,
        null
      ))
      .setComponentHooks(Parent, new ComponentHooks(
        addSelfToParent,
        removeSelfFromParent,
        null
      ))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerHierarchyTypes })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
