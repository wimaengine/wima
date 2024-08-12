import { Vector3 } from '../../../math/index.js'

export class Scale3D extends Vector3 {
  constructor(x = 1, y = 1, z = 1) {
    super(x, y, z)
  }
}