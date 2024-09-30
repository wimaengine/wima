import { App } from '../app/index.js'
import { Browser, PlatformOS } from './core/index.js'
import { Device } from './resources/index.js'

export class DevicePlugin {

  /**
   * @param {App} app 
   */
  register(app) {
    const device = new Device()
    const ua = navigator.userAgent
    const ae = new Audio()

    app.setResource(device)

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
        
    // audio capabilities
    if (window.AudioContext && window.AudioBuffer && window.AudioBufferSourceNode) {
      device.capabilities.webAudio = true
    }
    if (ae.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
      device.capabilities.supportedAudioFormats.push('ogg')
    }
    if (ae.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
      device.capabilities.supportedAudioFormats.push('mp3')
    }
    if (ae.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
      device.capabilities.supportedAudioFormats.push('wav')
    }
    if (ae.canPlayType('audio/x-m4a;').replace(/^no$/, '') || ae.canPlayType('audio/aac;').replace(/^no$/, '')) {
      device.capabilities.supportedAudioFormats.push('m4a')
    }

    // image formats supported
    // TODO - actually check supported image formats
    device.capabilities.supportedImageFormats.push('png', 'jpeg', 'svg', 'jpg')
  }
}