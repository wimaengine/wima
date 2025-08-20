import { AssetAdded, AssetDropped, AssetModified } from '../../asset/index.js'
import { Image } from '../assets/index.js'

/** @augments AssetAdded<Image> */
export class ImageAdded extends AssetAdded {}

/** @augments AssetModified<Image> */
export class ImageModified extends AssetModified {}

/** @augments AssetDropped<Image> */
export class ImageDropped extends AssetDropped {}