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