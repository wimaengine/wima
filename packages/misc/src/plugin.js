import { PluginGroup } from '@wimaengine/app'
import { AssetServerPlugin } from '@wimaengine/asset'
import { AudioPlugin } from '@wimaengine/audio'
import { ColorPlugin } from '@wimaengine/color'
import { CommandsPlugin } from '@wimaengine/command'
import { CorePlugin } from '@wimaengine/core'
import { Damping2DPlugin, Damping3DPlugin } from '@wimaengine/damping'
import { DevicePlugin } from '@wimaengine/device'
import { GeometryPlugin } from '@wimaengine/geometry'
import { Gravity2DPlugin, Gravity3DPlugin } from '@wimaengine/gravity'
import { HierarchyPlugin } from '@wimaengine/hierarchy'
import { InputPlugin } from '@wimaengine/input'
import { EulerIntegrator2DPlugin, EulerIntegrator3DPlugin } from '@wimaengine/integrator'
import { MathPlugin } from '@wimaengine/math'
import { Movable2DPlugin, Movable3DPlugin } from '@wimaengine/movable'
import { NamePlugin } from '@wimaengine/name'
import { Physics2DPlugin } from '@wimaengine/physics'
import { ProfilerPlugin } from '@wimaengine/profiler'
import { ReflectPlugin } from '@wimaengine/reflect'
import { RenderCorePlugin } from '@wimaengine/render-core'
import { ScenePlugin } from '@wimaengine/scene'
import { StoragePlugin } from '@wimaengine/storage'
import { TimePlugin } from '@wimaengine/time'
import { Transform2DPlugin, Transform3DPlugin } from '@wimaengine/transform'
import { DefaultTweenPlugin } from '@wimaengine/tween'
import { WindowPlugin } from '@wimaengine/window'

export class DefaultPlugin extends PluginGroup {
  constructor() {
    super()
    this.add(new CorePlugin())
    this.add(new ReflectPlugin())
    this.add(new TimePlugin())
    this.add(new MathPlugin())
    this.add(new ColorPlugin())
    this.add(new GeometryPlugin())
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
    this.add(new ScenePlugin())
  }
}
