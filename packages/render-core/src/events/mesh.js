import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Mesh } from '../assets'

/** @augments AssetAdded<Mesh> */
export class MeshAdded extends AssetAdded {}

/** @augments AssetModified<Mesh> */
export class MeshModified extends AssetModified {}

/** @augments AssetDropped<Mesh> */
export class MeshDropped extends AssetDropped {}
