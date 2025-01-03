import { Vector3 } from '../../../math/index.js'
import { Shape3 } from './shape3.js'

export class Plane extends Shape3 {
	constructor( normal = new Vector3( 1, 0, 0 ), constant = 0 ) {
	  super()
		this.normal = normal;
		this.constant = constant;
	}
}
