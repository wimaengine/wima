import { Vector2 } from '../../../math/index.js';
import { Shape2 } from './shape2.js'

export class Quadrilateral extends Shape2 {
	constructor( x = 0, y = 0 ) {
		this.extents = new Vector2(x,y)
	}
}
