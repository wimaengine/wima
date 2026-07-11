import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Scene } from '../assets'

/** @augments AssetAdded<Scene> */
export class SceneAdded extends AssetAdded {}

/** @augments AssetModified<Scene> */
export class SceneModified extends AssetModified {}

/** @augments AssetDropped<Scene> */
export class SceneDropped extends AssetDropped {}
