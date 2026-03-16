import { App } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { World, Entity, Query } from '../ecs/index.js'

export class EntityCountDiagnosticPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem(AppSchedule.Startup, setUpUI)
      .registerSystem(AppSchedule.Update, updateEntityCount)
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
  const entities = new Query(world, [Entity])
  const num = entities.count()
  const container = document.querySelector('#entity-count-container')

  if (container) container.innerHTML = `${num} entities`
}
