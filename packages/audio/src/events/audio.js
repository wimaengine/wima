import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Audio } from '../assets'

/** @augments AssetAdded<Audio> */
export class AudioAdded extends AssetAdded {}

/** @augments AssetModified<Audio> */
export class AudioModified extends AssetModified {}

/** @augments AssetDropped<Audio> */
export class AudioDropped extends AssetDropped {}
