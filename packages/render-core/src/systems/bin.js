/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */
import { Query } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'
import { GlobalTransform2D, GlobalTransform3D } from '@wimaengine/transform'
import { Material } from '../assets'
import { Camera } from '../components'
import { MaterialInstance } from '../components'
import { Meshed } from '../components'
import { RenderLists2D, RenderType, RenderLists3D } from '../components'

/**
 * @template {Material} T
 * @param {Constructor<T>} assettype
 * @param {Constructor<MaterialInstance<T>>} componenttype
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

/**
 * @template {Material} T
 * @param {Constructor<T>} assettype
 * @param {Constructor<MaterialInstance<T>>} componenttype
 * @returns {SystemFunc}
 */
export function genBinRenderables3D(assettype, componenttype) {
  const materialid = typeid(assettype)

  return function binRenders3D(world) {
    const renderables = new Query(world, [GlobalTransform3D, Meshed, componenttype])
    const cameras = new Query(world, [RenderLists3D, GlobalTransform3D, Camera])

    cameras.each(([renderLists]) => {
      renderLists.clear()
      const opaquePass = renderLists.getOpaquePass(materialid) || renderLists.setOpaquePass(materialid)

      renderables.each(([transform, mesh, material]) => {
        opaquePass.push(new RenderType(material.handle.id(), mesh.handle.id(), transform))
      })
    })
  }
}
