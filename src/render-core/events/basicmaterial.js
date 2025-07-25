import { AssetAdded, AssetDropped, AssetModified } from '../../asset/index.js'
import { BasicMaterial } from '../assets/index.js'

/** @augments AssetAdded<BasicMaterial> */
export class BasicMaterialAdded extends AssetAdded {}

/** @augments AssetModified<BasicMaterial> */
export class BasicMaterialModified extends AssetModified {}

/** @augments AssetDropped<BasicMaterial> */
export class BasicMaterialDropped extends AssetDropped {}