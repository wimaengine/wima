/** @import {WindowOptions} from './components' */
import { App, Plugin } from '@wimaengine/app'
import { EntityCommands } from '@wimaengine/commands'
import { CommandsPlugin } from '@wimaengine/command'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { EventPlugin } from '@wimaengine/event'
import { ReflectPlugin } from '@wimaengine/reflect'
import { Window, MainWindow } from './components'
import {
  FileDrag,
  FileDrop,
  KeyDown,
  KeyUp,
  PointerCancel,
  PointerDown,
  PointerEnter,
  PointerLeave,
  PointerMove,
  PointerWheel,
  PointerUp,
  WindowMove,
  WindowResize
} from './events'
import { Windows } from './resources'
import { registerWindowTypes } from './systems'
import { typeid } from '@wimaengine/type'

export class WindowPlugin extends Plugin {

  /**
   * @readonly
   * @type {boolean}
   */
  initPrimaryWindow

  /**
   * @readonly
   * @type {WindowOptions | undefined}
   */
  primaryWindowOptions

  /**
   * @param {WindowPluginOptions} options
   */
  constructor({
    initPrimaryWindow = true,
    primaryWindowOptions
  } = {}) {
    super()
    this.initPrimaryWindow = initPrimaryWindow
    this.primaryWindowOptions = primaryWindowOptions
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerWindowTypes })
      .registerPlugin(new EventPlugin({
        event:WindowMove
      }))
      .registerPlugin(new EventPlugin({
        event:WindowResize
      }))
      .registerPlugin(new EventPlugin({
        event:KeyDown
      }))
      .registerPlugin(new EventPlugin({
        event:KeyUp
      }))
      .registerPlugin(new EventPlugin({
        event:PointerWheel
      }))
      .registerPlugin(new EventPlugin({
        event:PointerDown
      }))
      .registerPlugin(new EventPlugin({
        event:PointerUp
      }))
      .registerPlugin(new EventPlugin({
        event:PointerMove
      }))
      .registerPlugin(new EventPlugin({
        event:PointerEnter
      }))
      .registerPlugin(new EventPlugin({
        event:PointerLeave
      }))
      .registerPlugin(new EventPlugin({
        event:PointerCancel
      }))
      .registerPlugin(new EventPlugin({
        event:FileDrag
      }))
      .registerPlugin(new EventPlugin({
        event:FileDrop
      }))
      .setResource(new Windows())

    if (this.initPrimaryWindow) app.registerSystem({ schedule: AppSchedule.Startup, system: initPrimaryWindow(this.primaryWindowOptions) })
  }

  requires() {
    const requires = [typeid(CorePlugin), typeid(ReflectPlugin)]

    if (this.initPrimaryWindow) {
      requires.push(typeid(CommandsPlugin))
    }

    return requires
  }
}

/**
 * @param {WindowOptions | undefined} settings
 * @returns {import('@wimaengine/ecs').SystemFunc}
 */
function initPrimaryWindow(settings) {
  return function initPrimaryWindow(world) {

    const commands = new EntityCommands(world)

    commands
      .spawn()
      .insertPrefab([
        new Window(settings),
        new MainWindow()
      ])
      .build()
  }
}

/**
 * @typedef WindowPluginOptions
 * @property {boolean} [initPrimaryWindow = true]
 * @property { WindowOptions | undefined } [primaryWindowOptions]
 */
