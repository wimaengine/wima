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
import { App, AppSchedule } from '../app/index.js'
import { World } from '../ecs/index.js'
import { Window, MainWindow } from './components/index.js'
import { WindowCommands, Windows } from './resources/index.js'

export class WindowPlugin {

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
      .registerEvent(WindowMove)
      .registerEvent(WindowResize)
      .registerEvent(KeyDown)
      .registerEvent(KeyUp)
      .registerEvent(MouseDown)
      .registerEvent(MouseMove)
      .registerEvent(MouseUp)
      .registerEvent(MouseWheel)
      .registerEvent(MouseEnter)
      .registerEvent(MouseLeave)
      .registerEvent(TouchStart)
      .registerEvent(TouchMove)
      .registerEvent(TouchEnd)
      .registerEvent(TouchCancel)
      .registerEvent(WindowResize)
      .registerEvent(FileDrag)
      .registerEvent(FileDrop)
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