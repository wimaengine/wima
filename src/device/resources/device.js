import { Browser } from '../core/browser.js'
import { PlatformOS } from '../core/platform.js'

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
   * Whether this device supports Audio tag.
   *
   * @type {boolean}
   */
  audio = !!new Audio().canPlayType

  /**
   * A list of audio extensions this device supports.
   *
   * @type {Set<string>}
   */
  supportedAudioFormats = new Set()

  /**
   * A list of image extensions this device supports.
   *
   * @type {Set<string>}
   */
  supportedImageFormats = new Set()
}