import { Vector2 } from '../../../math/index.js';
import { Shape2 } from './shape2.js'

export class Rectangle extends Shape2 {
	constructor( x = 0, y = 0 ) {
	  super()
		this.halfExtents = new Vector2(x,y)
	}
}
