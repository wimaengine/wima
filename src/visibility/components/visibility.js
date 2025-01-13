import { VisibilityMode } from "../core/index.js"

export class Visibility {
  /**
   * @type {VisibilityMode}
   */
  mode
  /**
   * @private
   * @type {boolean}
   */
  computed
  constructor(mode = VisibilityMode.Inherit){
    this.mode = mode
  }
}