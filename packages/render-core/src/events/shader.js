import { AssetAdded, AssetDropped, AssetModified } from '@wimaengine/asset'
import { Shader } from '../assets'

/** @augments AssetAdded<Shader> */
export class ShaderAdded extends AssetAdded {}

/** @augments AssetModified<Shader> */
export class ShaderModified extends AssetModified {}

/** @augments AssetDropped<Shader> */
export class ShaderDropped extends AssetDropped {}
