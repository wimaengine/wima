import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { Device, DeviceCapabilities } from '../resources'
import { Browser } from '../core'
import { PlatformOS } from '../core'

/**
 * @param {World} world
 */
export function registerDeviceTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const platformOsId = setTypeId('PlatformOS')
  const browserId = setTypeId('Browser')

  registry.registerTypeId(platformOsId, new EnumInfo(PlatformOS))
  registry.registerTypeId(browserId, new EnumInfo(Browser))

  registry.register(DeviceCapabilities, new StructInfo({
    webgpu: new Field(typeid(Boolean)),
    webgl: new Field(typeid(Boolean)),
    canvas: new Field(typeid(Boolean)),
    webAudio: new Field(typeid(Boolean))
  }))
  registry.get(DeviceCapabilities)?.setMethod(DeviceCapabilities.serialize)
  registry.get(DeviceCapabilities)?.setMethod(DeviceCapabilities.deserialize)
  registry.register(Device, new StructInfo({
    capabilities: new Field(typeid(DeviceCapabilities)),
    platform: new Field(platformOsId),
    browser: new Field(browserId)
  }))
  registry.get(Device)?.setMethod(Device.serialize)
  registry.get(Device)?.setMethod(Device.deserialize)
}
