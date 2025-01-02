import { Vector2 } from '../../../math/index.js';

export class Box2 {
	constructor( x = 0, y = 0 ) {
		this.min = new Vector2(x,y)
	}
}
