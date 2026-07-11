import { Browser, PlatformOS } from '../core'

/**
 * Contains values showing which features are supported,general model of the device and browser used.
 */
export class Device {

  /**
   * @type {DeviceCapabilities}
   */
  capabilities = new DeviceCapabilities()

  /**
   * Whether this device uses windows.
   *
   * @type {PlatformOS}
   */
  platform = PlatformOS.Unknown

  /**
   * Browser that the device is using to access the application.
   *
   * @type {Browser}
   */
  browser = Browser.Unknown

  isMobile() {
    return (
      this.platform === PlatformOS.Android ||
      this.platform === PlatformOS.Ios
    )
  }

  isPc() {
    return (
      this.platform === PlatformOS.Linux ||
      this.platform === PlatformOS.Mac ||
      this.platform === PlatformOS.Windows
    )
  }

  /**
   * @param {Device} value
   */
  static serialize(value) {
    return {
      capabilities: DeviceCapabilities.serialize(value.capabilities),
      platform: value.platform,
      browser: value.browser
    }
  }

  /**
   * @param {DeviceSerial} value
   * @param {Device} [out]
   */
  static deserialize(value, out = new Device()) {

    out.capabilities = DeviceCapabilities.deserialize(value.capabilities, out.capabilities)
    out.platform = value.platform
    out.browser = value.browser

    return out
  }
}

export class DeviceCapabilities {

  /**
   * Whether this device supports WebGPU.
   *
   * @type {boolean}
   */
  webgpu = false

  /**
   * Whether this device supports WebGL.
   *
   * @type {boolean}
   */
  webgl = false

  /**
   * Whether this device supports 2D canvas.
   *
   * @type {boolean}
   */
  canvas = !!window.CanvasRenderingContext2D

  /**
   * Whether this device supports WebAudio.
   *
   * @type {boolean}
   */
  webAudio = false

  /**
   * @param {DeviceCapabilities} value
   */
  static serialize(value) {
    return {
      webgpu: value.webgpu,
      webgl: value.webgl,
      canvas: value.canvas,
      webAudio: value.webAudio
    }
  }

  /**
   * @param {DeviceCapabilitiesSerial} value
   * @param {DeviceCapabilities} [out]
   */
  static deserialize(value, out = new DeviceCapabilities()) {
    out.webgpu = value.webgpu
    out.webgl = value.webgl
    out.canvas = value.canvas
    out.webAudio = value.webAudio

    return out
  }
}

/**
 * @typedef DeviceCapabilitiesSerial
 * @property {boolean} webgpu
 * @property {boolean} webgl
 * @property {boolean} canvas
 * @property {boolean} webAudio
 */

/**
 * @typedef DeviceSerial
 * @property {DeviceCapabilitiesSerial} capabilities
 * @property {import('../core').PlatformOS} platform
 * @property {import('../core').Browser} browser
 */
