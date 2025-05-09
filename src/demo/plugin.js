import { App, AppSchedule } from '../app/index.js'
import { EntityCommands } from '../command/index.js'
import { Query, World, Entity } from '../ecs/index.js'
import { Storage } from '../storage/index.js'
import { Cleanup } from './components/index.js'
import { Demo } from './core/demo.js'
import { CurrentDemo, DemoList } from './resources/index.js'
import { createDropDown } from './utils.js'

const storageLabel = 'demo'

export class DemoPlugin {

  /**
   * @readonly
   * @type {Demo[]}
   */
  demos

  /**
   * @param {DemoPluginOptions} demos 
   */
  constructor({ demos = [] }) {
    this.demos = demos
  }

  /**
   * @param {App} app
   */
  register(app) {
    const namedDemos = /** @type {[string,Demo][]}*/(this.demos.map((e) => [e.name, e]))

    app
      .registerType(Cleanup)
      .setResource(new DemoList(namedDemos))
      .setResource(new CurrentDemo(new Demo('default')))
      .registerSystem(AppSchedule.Startup, initDemo)
      .registerSystem(AppSchedule.Startup, initDemoUI)
      .registerSystem(AppSchedule.Update, advanceCurrentDemo)
  }
}

/**
 * @param {World} world
 */
function initDemo(world) {
  const demolist = world.getResource(DemoList)
  const current = world.getResource(CurrentDemo)
  const storage = world.getResource(Storage)
  const demoName = storage.get(storageLabel)

  /** @type {[string,Demo]} */
  const [defaultDemoName, defaultDemo] = demolist.entries().next().value

  if (defaultDemo) {
    current.set(defaultDemoName, defaultDemo)
    defaultDemo.init.forEach((init) => init(world))
  }
  if (demoName) {
    const demo = demolist.get(demoName)

    if (demo) {
      current.set(demoName, demo)
      demo.init.forEach((init) => init(world))
    }
  }
}

/**
 * @param {World} world
 */
function initDemoUI(world) {
  const commands = world.getResource(EntityCommands)
  const demolist = world.getResource(DemoList)
  const currentdemo = world.getResource(CurrentDemo)
  const storage = world.getResource(Storage)

  const optionTab = document.createElement('div')
  const option = createDropDown(demolist.keys(), (e) => {
    const entities = (new Query(world, [Entity, Cleanup]))
    const name = /** @type {HTMLOptionElement} */(e.target).value
    const demo = demolist.get(name)

    entities.each(([entity]) => {
      commands.despawn(entity)
    })

    if (demo) {
      storage.set(storageLabel, name)
      currentdemo.set(name, demo)
      demo.init.forEach((init) => init(world))
    }
  })

  document.body.append(optionTab)
  optionTab.append(option)

  option.value = currentdemo.getName()
  optionTab.style.position = 'absolute'
  optionTab.style.top = '0px'
  optionTab.style.left = '0px'
  optionTab.id = 'demo-options'
}

/**
 * @param {World} world
 */
function advanceCurrentDemo(world) {

  /** @type {CurrentDemo} */
  const demo = world.getResource('currentdemo')

  demo.get().update.forEach((update) => update(world))
}

/**
 * @typedef DemoPluginOptions
 * @property {Demo[]} demos
 */