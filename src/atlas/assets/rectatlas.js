import { Vector4 } from '../../math/index.js';

export class RectAtlas {
  /**
   * @type {Vector4[]}
   */
  rects = []
  constructor() {}
  static
  default () {
    return new RectAtlas()
  }
}