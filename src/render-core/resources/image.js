/** @import { TypeRegistry } from '../../reflect/resources/index.js' */
import { Importer } from '../../asset/index.js'
import { Image } from '../assets/index.js'
import { Vector2 } from '../../math/index.js'

/**
 * @augments {Importer<Image>}
 */
export class ImageImporter extends Importer {

  constructor() {
    super(Image)
  }

  getExtensions() {

    // TODO: Actually get the supported image formats
    return ['png', 'jpeg']
  }

  /**
   * @param {Response} response
   * @param {TypeRegistry} _typeRegistry
   */
  async deserialize(response, _typeRegistry) {
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
