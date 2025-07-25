import { AssetAdded, AssetModified } from '../../asset/index.js'
import { Image } from '../assets/index.js'

/** @augments AssetAdded<Image> */
export class ImageAdded extends AssetAdded {}

/** @augments AssetModified<Image> */
export class ImageModified extends AssetModified {}
