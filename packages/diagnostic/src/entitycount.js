import { App, Plugin } from '@wimaengine/app'
import { CorePlugin } from '@wimaengine/core'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { World, EntityHandle, Query } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'

export class EntityCountDiagnosticPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: setUpUI })
      .registerSystem({ schedule: AppSchedule.Update, systemGroup: CoreSystems.End, system: updateEntityCount })
  }

  requires() {
    return [typeid(CorePlugin)]
  }
}

/**
 *
 */
function setUpUI() {
  const container = document.body.appendChild(document.createElement('div'))

  container.id = 'entity-count-container'
  container.style.position = 'absolute'
  container.style.top = '34px'
  container.style.right = '0px'
  container.style.width = '100px'
  container.style.height = '20px'
  container.style.background = 'black'
  container.style.textAlign = 'center'
  container.style.color = 'white'
}

/**
 * @param {World} world
 */
function updateEntityCount(world) {
  const entities = new Query(world, [EntityHandle])
  const num = entities.count()
  const container = document.querySelector('#entity-count-container')

  if (container) container.innerHTML = `${num} entities`
}
