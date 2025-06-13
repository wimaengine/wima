/** @import {WindowOptions} from './components/window.js' */
import {
  FileDrag,
  FileDrop,
  KeyDown,
  KeyUp,
  MouseDown,
  MouseEnter,
  MouseLeave,
  MouseMove,
  MouseUp,
  MouseWheel,
  TouchCancel,
  TouchEnd,
  TouchMove,
  TouchStart,
  WindowMove,
  WindowResize
} from './events/index.js'
import { App, AppSchedule, Plugin } from '../app/index.js'
import { World } from '../ecs/index.js'
import { Window, MainWindow } from './components/index.js'
import { WindowCommands, Windows } from './resources/index.js'
import { EventPlugin } from '../event/plugin.js'

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
        event:MouseDown
      }))
      .registerPlugin(new EventPlugin({
        event:MouseUp
      }))
      .registerPlugin(new EventPlugin({
        event:MouseMove
      }))
      .registerPlugin(new EventPlugin({
        event:MouseWheel
      }))
      .registerPlugin(new EventPlugin({
        event:MouseEnter
      }))
      .registerPlugin(new EventPlugin({
        event:MouseLeave
      }))
      .registerPlugin(new EventPlugin({
        event:TouchStart
      }))
      .registerPlugin(new EventPlugin({
        event:TouchEnd
      }))
      .registerPlugin(new EventPlugin({
        event:TouchMove
      }))
      .registerPlugin(new EventPlugin({
        event:TouchCancel
      }))
      .registerPlugin(new EventPlugin({
        event:FileDrag
      }))
      .registerPlugin(new EventPlugin({
        event:FileDrop
      }))
      .setResource(new Windows())
      .setResource(new WindowCommands())

    if (this.initPrimaryWindow) app.registerSystem(AppSchedule.Startup, initPrimaryWindow)
  }
}

/**
 * @param {World} world 
 */
function initPrimaryWindow(world) {
  world.create([new Window(), new MainWindow()])
}

/**
 * @typedef WindowPluginOptions
 * @property {boolean} [initPrimaryWindow = true]
 * @property { WindowOptions | undefined } [primaryWindowOptions]
 */