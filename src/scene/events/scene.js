import { AssetAdded, AssetDropped, AssetModified } from '../../asset/index.js'
import { Scene } from '../assets/index.js'

/** @augments AssetAdded<Scene> */
export class SceneAdded extends AssetAdded {}

/** @augments AssetModified<Scene> */
export class SceneModified extends AssetModified {}

/** @augments AssetDropped<Scene> */
export class SceneDropped extends AssetDropped {}