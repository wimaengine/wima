import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Image } from '../assets'

/** @augments AssetAdded<Image> */
export class ImageAdded extends AssetAdded {}

/** @augments AssetModified<Image> */
export class ImageModified extends AssetModified {}

/** @augments AssetDropped<Image> */
export class ImageDropped extends AssetDropped {}
