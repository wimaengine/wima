/** @import {Entity} from '../ecs/index.js'; */
import { App, AppSchedule } from '../app/index.js'
import { Assets, Handle } from '../asset/index.js'
import { ComponentHooks, Query, World } from '../ecs/index.js'
import { EventDispatch } from '../event/index.js'
import { assert, warn } from '../logger/index.js'
import { Camera, Material, MaterialHandle, Mesh, MeshHandle, ProgramCache } from '../render-core/index.js'
import { GlobalTransform3D } from '../transform/index.js'
import { MainWindow, WindowResize, Windows } from '../window/index.js'
import { materialAddHook, meshAddHook } from './hooks/index.js'
import { AttributeMap, ClearColor, MeshCache, UBOCache } from './resources/index.js'

export class WebglRendererPlugin {

  /**
   * @param {App} app
   */
  register(app) {
    const attribute = new AttributeMap()

    app
      .setResource(new ProgramCache())
      .setResource(new MeshCache())
      .setResource(new UBOCache())
      .setResource(new ClearColor())
      .setResource(attribute)
      .setComponentHooks(MaterialHandle, new ComponentHooks(materialAddHook))
      .setComponentHooks(MeshHandle, new ComponentHooks(meshAddHook))
  }
}