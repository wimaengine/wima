import { Color } from '../../color/index.js'

export class ClearColor extends Color {
  constructor() {
    super(0, 0, 0)
  }

  /**
   * @param {ClearColor} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../../color/index.js').ColorSerial} value
   * @param {ClearColor} [out]
   */
  static deserialize(value, out = new ClearColor()) {
    return super.deserialize(value, out)
  }
}
