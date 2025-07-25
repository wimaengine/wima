import { AssetAdded, AssetDropped, AssetModified } from '../../asset/index.js'
import { Audio } from '../assets/index.js'

/** @augments AssetAdded<Audio> */
export class AudioAdded extends AssetAdded {}

/** @augments AssetModified<Audio> */
export class AudioModified extends AssetModified {}

/** @augments AssetDropped<Audio> */
export class AudioDropped extends AssetDropped {}