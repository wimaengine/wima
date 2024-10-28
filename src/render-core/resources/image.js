import { Parser } from '../../asset/core/parser.js'
import { Image } from '../../asset/index.js'
import { Vector2 } from '../../math/index.js'

/**
 * @augments {Parser<Image>}
 */
export class ImageParser extends Parser {

  /**
   * @param {string} _extension
   */
  verify(_extension) {
    return true
  }
  
  /**
   * @param {Response} response
   */
  async parse(response) {
    const raw = await response.arrayBuffer()
    const dimensions = await getDimensions(raw)

    return new Image(new Uint8ClampedArray(raw), dimensions)
  }
}

/**
 * @param {BlobPart} raw
 * @returns {Promise<Vector2>}
 */
function getDimensions(raw) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([raw]))
    const img = document.createElement('img')

    img.onload = () => {
      resolve(new Vector2(img.width, img.height))
      URL.revokeObjectURL(url)
    }
    img.src = url

  })
}