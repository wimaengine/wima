import { Vector3 } from '../../../math/index.js'
import { Shape3 } from './shape3.js'

export class Cuboid extends Shape3 {
  constructor(
    x = 0.5,
    y = 0.5,
    z = 0.5
  ) {
    super()
    this.extents = new Vector3(x, y, z)
  }
}