import { AssetAdded, AssetDropped, AssetModified } from '../../asset/index.js'
import { Shader } from '../assets/index.js'

/** @augments AssetAdded<Shader> */
export class ShaderAdded extends AssetAdded {}

/** @augments AssetModified<Shader> */
export class ShaderModified extends AssetModified {}

/** @augments AssetDropped<Shader> */
export class ShaderDropped extends AssetDropped {}