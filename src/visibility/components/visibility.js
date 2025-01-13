import { VisibilityMode } from "../core/index.js"

export class Visibility {
  /**
   * @type {VisibilityMode}
   */
  mode
  constructor(mode = VisibilityMode.Inherit){
    this.mode = mode
  }
}