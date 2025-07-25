import { AssetAdded, AssetDropped, AssetModified } from '../../asset/index.js'
import { Mesh } from '../assets/index.js'

/** @augments AssetAdded<Mesh> */
export class MeshAdded extends AssetAdded {}

/** @augments AssetModified<Mesh> */
export class MeshModified extends AssetModified {}

/** @augments AssetDropped<Mesh> */
export class MeshDropped extends AssetDropped {}