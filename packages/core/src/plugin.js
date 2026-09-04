/** @import { App } from '@wimaengine/app' */
import { Plugin } from '@wimaengine/app'
import { SchedulerBuilder } from '@wimaengine/schedule'
import { ReflectPlugin } from '@wimaengine/reflect'
import { AppSchedule, CoreSystems, MainWorld, defaultRunner } from './core'
import { registerCoreTypes, registerPrimitiveTypes } from './systems'
import { typeid } from '@wimaengine/type'

export class CorePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setWorld(MainWorld)
      .defaultWorld(MainWorld)
      .setResource(SchedulerBuilder.Instance)
      .setRunner(defaultRunner)
      .createSchedule({
        label: AppSchedule.Startup,
        repeat: false,
        defaultSystemGroup: CoreSystems.Main
      })
      .createSchedule({
        label: AppSchedule.Update,
        repeat: true,
        defaultSystemGroup: CoreSystems.Main
      })
      .registerSystemGroup({
        label: CoreSystems.Start,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.PreMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PreMain,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.Main]
      })
      .registerSystemGroup({
        label: CoreSystems.Main,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.PostMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PostMain,
        schedule: AppSchedule.Startup,
        before: [CoreSystems.End]
      })
      .registerSystemGroup({
        label: CoreSystems.End,
        schedule: AppSchedule.Startup
      })

      .registerSystemGroup({
        label: CoreSystems.Start,
        schedule: AppSchedule.Update,
        before: [CoreSystems.PreMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PreMain,
        schedule: AppSchedule.Update,
        before: [CoreSystems.Main]
      })
      .registerSystemGroup({
        label: CoreSystems.Main,
        schedule: AppSchedule.Update,
        before: [CoreSystems.PostMain]
      })
      .registerSystemGroup({
        label: CoreSystems.PostMain,
        schedule: AppSchedule.Update,
        before: [CoreSystems.End]
      })
      .registerSystemGroup({
        label: CoreSystems.End,
        schedule: AppSchedule.Update
      })
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerCoreTypes
      })
      .registerSystem({
        schedule: AppSchedule.Startup,
        system: registerPrimitiveTypes
      })
  }

  requires() {
    return [typeid(ReflectPlugin)]
  }
}
