import { Orientation3D, Position3D, Scale3D } from '../../transform/index.js'
import { Velocity3D, Rotation3D, Acceleration3D, Torque3D } from '../components/index.js'

/**
 * @returns {[Position3D,Orientation3D, Scale3D,Velocity3D,Rotation3D,Acceleration3D,Torque3D]}
 */
export function createMovable3D() {
  return [new Position3D(), new Orientation3D(), new Velocity3D(), new Scale3D(), new Rotation3D(), new Acceleration3D(), new Torque3D()]
}