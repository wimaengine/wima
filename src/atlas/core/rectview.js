export class RectAtlasView {
  /**
   * @type {Handle<RectAtlas>}
   */
  atlas
  /**
   * @type {number}
   */
  index
  constructor(atlas,index) {
    this.atlas = atlas
    this.index = index
  }
}