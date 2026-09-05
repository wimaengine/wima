import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { Browser, PlatformOS } from './core'
import { Device } from './resources'
import { registerDeviceTypes } from './systems'

export class DevicePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const device = new Device()
    const ua = navigator.userAgent

    app
      .setResource(device)
      .registerSystem({ schedule: AppSchedule.Startup, system: registerDeviceTypes })

    // rendering capabilities
    device.capabilities.canvas = !!window.CanvasRenderingContext2D
    device.capabilities.webgl = !!window.WebGLRenderingContext

    // @ts-ignore
    // Safety: Navigator.gpu is implemented in webgpu enabled devices
    device.capabilities.webgpu = !!navigator.gpu

    // platform operating system
    if (/Android/.test(ua)) {
      device.platform = PlatformOS.Android
    } else if (/iP[ao]d|iPhone/i.test(ua)) {
      device.platform = PlatformOS.Ios
    } else if (/Linux/.test(ua)) {
      device.platform = PlatformOS.Linux
    } else if (/Mac OS/.test(ua)) {
      device.platform = PlatformOS.Mac
    } else if (/Windows/.test(ua)) {
      device.platform = PlatformOS.Windows
    }

    // browser
    if (/Chrome/.test(ua)) {
      device.browser = Browser.Chrome
    } else if (/Firefox/.test(ua)) {
      device.browser = Browser.FireFox
    } else if (/Trident/.test(ua)) {
      device.browser = Browser.Edge
    } else if (/Opera/.test(ua)) {
      device.browser = Browser.Opera
    } else if (/Safari/.test(ua)) {
      device.browser = Browser.Safari
    }
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
