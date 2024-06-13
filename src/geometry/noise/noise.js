import { Interpolation } from '../../math/index.js'

export class Noise {

  /**
   * @param {number} value
   * @param {number} seed
   */
  static get1D(value, seed) {
    const x = value + seed
    const y = BigInt((x << 13) ^ x)
    const z = (y * (y * y * 15731n + 789221n) + 1376312589n)
    const w = parseInt(z.toString(2).slice(-31), 2)

    return 1.0 - w / 1073741824
  }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} seed
 */
  static get2D(x, y, seed) {
    const intX = Math.floor(x)
    const intY = Math.floor(y)

    const tx = x - intX
    const ty = y - intY

    const a = Noise.get1D(intX + intY, seed)
    const b = Noise.get1D(intX + 1 + intY, seed)
    const c = Noise.get1D(intX + intY + 1, seed)
    const d = Noise.get1D(intX + 1 + intY + 1, seed)

    return Interpolation.cosine(
      Interpolation.cosine(a, b, tx),
      Interpolation.cosine(c, d, ty),
      ty
    )
  }
}