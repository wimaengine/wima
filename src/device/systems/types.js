import { World } from '../../ecs/index.js'
import { EnumInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid } from '../../type/index.js'
import { Device, DeviceCapabilities } from '../resources/index.js'
import { Browser } from '../core/browser.js'
import { PlatformOS } from '../core/platform.js'

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
  registry.register(Device, new StructInfo({
    capabilities: new Field(typeid(DeviceCapabilities)),
    platform: new Field(platformOsId),
    browser: new Field(browserId)
  }))
}
