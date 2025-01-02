import { Vector3 } from '../../../math/index.js'

export class Plane {
	constructor( normal = new Vector3( 1, 0, 0 ), constant = 0 ) {
		this.normal = normal;
		this.constant = constant;
	}
}
