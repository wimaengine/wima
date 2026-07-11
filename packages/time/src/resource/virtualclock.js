import { Clock } from '../clock'

export class VirtualClock extends Clock {

  /**
   * @param {Clock} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../clock').ClockSerial} value
   * @param {VirtualClock} [out]
   */
  static deserialize(value, out = new VirtualClock()) {
    return super.deserialize(value, out)
  }
}
