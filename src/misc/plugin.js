import { PluginGroup } from '../app/index.js'
import { ProfilerPlugin } from '../profiler/index.js'
import { AudioPlugin } from '../audio/index.js'
import { AssetServerPlugin } from '../asset/index.js'
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
import { NamePlugin } from '../name/index.js'
import { ReflectPlugin } from '../reflect/plugin.js'

export class DefaultPlugin extends PluginGroup {
  constructor() {
    super()
    this.add(new ReflectPlugin())
    this.add(new TimePlugin())
    this.add(new NamePlugin())
    this.add(new DevicePlugin())
    this.add(new StoragePlugin())
    this.add(new AssetServerPlugin())
    this.add(new AudioPlugin())
    this.add(new InputPlugin())
    this.add(new HierarchyPlugin())
    this.add(new Movable2DPlugin())
    this.add(new Movable3DPlugin())
    this.add(new Gravity2DPlugin())
    this.add(new Gravity3DPlugin())
    this.add(new Physics2DPlugin())
    this.add(new Damping2DPlugin())
    this.add(new Damping3DPlugin())
    this.add(new DefaultTweenPlugin())
    this.add(new Transform2DPlugin())
    this.add(new Transform3DPlugin())
    this.add(new EulerIntegrator2DPlugin())
    this.add(new EulerIntegrator3DPlugin())
    this.add(new ProfilerPlugin())
    this.add(new RenderCorePlugin())
    this.add(new WindowPlugin())
    this.add(new CommandsPlugin())
  }
}
