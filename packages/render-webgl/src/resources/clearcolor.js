import { Color } from '@wimaengine/color'

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
   * @param {import('@wimaengine/color').ColorSerial} value
   * @param {ClearColor} [out]
   */
  static deserialize(value, out = new ClearColor()) {
    return super.deserialize(value, out)
  }
}
