import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { BasicMaterial } from '../assets'

/** @augments AssetAdded<BasicMaterial> */
export class BasicMaterialAdded extends AssetAdded {}

/** @augments AssetModified<BasicMaterial> */
export class BasicMaterialModified extends AssetModified {}

/** @augments AssetDropped<BasicMaterial> */
export class BasicMaterialDropped extends AssetDropped {}
