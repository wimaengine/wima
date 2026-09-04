import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { PhysicsProperties } from './components'
import { physicspropertiesAddHook } from './hooks'
import { Contacts, SATNarrowphase2D } from './resources'
import { getSATContacts, registerNarrowphase2DTypes } from './systems'

/**
 * Uses the Separation Axis Theorem.
 * Best when your body shapes have few vertices.
 */
export class NarrowPhase2DPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(
        PhysicsProperties,
        new ComponentHooks(
          physicspropertiesAddHook,
          null,
          physicspropertiesAddHook
        )
      )
      .setResource(new Contacts())
      .setResource(new SATNarrowphase2D())
      .registerSystem({ schedule: AppSchedule.Startup, system: registerNarrowphase2DTypes })
      .registerSystem({ schedule: AppSchedule.Update, system: getSATContacts })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(MathPlugin)]
  }
}
