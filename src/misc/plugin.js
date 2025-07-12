import { App, Plugin } from '../app/index.js'
import { ProfilerPlugin } from '../profiler/index.js'
import { AudioPlugin } from '../audio/index.js'
import { CommandsPlugin } from '../command/index.js'
import { Damping2DPlugin, Damping3DPlugin } from '../damping/index.js'
import { DevicePlugin } from '../device/index.js'
import { Gravity2DPlugin, Gravity3DPlugin } from '../gravity/index.js'
import { HierarchyPlugin } from '../hierarchy/index.js'
import { InputPlugin } from '../input/index.js'
import { EulerIntegrator2DPlugin, EulerIntegrator3DPlugin } from '../integrator/index.js'
import { Movable2DPlugin, Movable3DPlugin } from '../movable/index.js'
import { Physics2DPlugin } from '../physics/index.js'
import { RenderCorePlugin } from '../render-core/index.js'
import { StoragePlugin } from '../storage/index.js'
import { TimePlugin } from '../time/index.js'
import { Transform2DPlugin, Transform3DPlugin } from '../transform/index.js'
import { DefaultTweenPlugin } from '../tween/index.js'
import { WindowPlugin } from '../window/index.js'

export class DefaultPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerPlugin(new TimePlugin())
      .registerPlugin(new DevicePlugin())
      .registerPlugin(new StoragePlugin())
      .registerPlugin(new AudioPlugin())
      .registerPlugin(new InputPlugin())
      .registerPlugin(new HierarchyPlugin())
      .registerPlugin(new Movable2DPlugin())
      .registerPlugin(new Movable3DPlugin())
      .registerPlugin(new Gravity2DPlugin())
      .registerPlugin(new Gravity3DPlugin())
      .registerPlugin(new Physics2DPlugin())
      .registerPlugin(new Damping2DPlugin())
      .registerPlugin(new Damping3DPlugin())
      .registerPlugin(new DefaultTweenPlugin())
      .registerPlugin(new Transform2DPlugin())
      .registerPlugin(new Transform3DPlugin())
      .registerPlugin(new EulerIntegrator2DPlugin())
      .registerPlugin(new EulerIntegrator3DPlugin())
      .registerPlugin(new ProfilerPlugin())
      .registerPlugin(new RenderCorePlugin())
      .registerPlugin(new WindowPlugin())
      .registerPlugin(new CommandsPlugin())
  }
}