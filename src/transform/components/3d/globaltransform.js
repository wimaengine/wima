import { Matrix3x4 } from '../../../math/index.js'

export class GlobalTransform3D extends Matrix3x4 {
  compose(position, orientation, scale) {
    Matrix3x4.compose(position, orientation, scale, this)
  }
}