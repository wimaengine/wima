/** @import { SystemFunc } from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
import { Query } from '../../ecs/query.js'
import { typeid } from '../../reflect/index.js'
import { GlobalTransform2D, GlobalTransform3D } from '../../transform/index.js'
import { Material } from '../assets/material.js'
import { Camera } from '../components/camera.js'
import { Material2D } from '../components/material.js'
import { Meshed } from '../components/mesh.js'
import { RenderLists2D, RenderType } from '../components/index.js'

/**
 * @template {Material} T
 * @param {Constructor<T>} assettype
 * @param {Constructor<Material2D<T>>} componenttype
 * @returns {SystemFunc}
 */
export function genBinRenderables2D(assettype, componenttype) {
  const materialid = typeid(assettype)
  
  return function binRenders2D(world) {
    const renderables = new Query(world, [GlobalTransform2D, Meshed, componenttype])
    const cameras = new Query(world, [RenderLists2D, GlobalTransform2D, Camera])
  
    cameras.each(([renderLists]) => {
      renderLists.clear()
      const opaquePass = renderLists.getOpaquePass(materialid) || renderLists.setOpaquePass(materialid)
  
      renderables.each(([transform, mesh, material]) => {
        opaquePass.push(new RenderType(material.handle.id(), mesh.handle.id(), transform))
      })
    })
  }
}