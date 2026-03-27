/** @import {WindowOptions} from './components/window.js' */
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
} from './events/index.js'
import { App, Plugin } from '../app/index.js'
import { World } from '../ecs/index.js'
import { Window, MainWindow } from './components/index.js'
import { Windows } from './resources/index.js'
import { EventPlugin } from '../event/plugin.js'
import { EntityCommands } from '../core/index.js'
import { AppSchedule } from '../core/index.js'
import { registerWindowTypes } from './systems/index.js'

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
      .registerType(Window)
      .registerType(MainWindow)
      .registerSystem(AppSchedule.Startup, registerWindowTypes)
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

    if (this.initPrimaryWindow) app.registerSystem(AppSchedule.Startup, initPrimaryWindow)
  }
}

/**
 * @param {World} world
 */
function initPrimaryWindow(world) {
  const commands = new EntityCommands(world)

  commands
    .spawn()
    .insertPrefab([
      new Window(),
      new MainWindow()
    ])
    .build()
}

/**
 * @typedef WindowPluginOptions
 * @property {boolean} [initPrimaryWindow = true]
 * @property { WindowOptions | undefined } [primaryWindowOptions]
 */
