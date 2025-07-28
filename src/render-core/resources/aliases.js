import { Assets } from '../../asset/index.js'
import { BasicMaterial, Mesh, Image } from '../assets/index.js'

/**
 * @augments {Assets<Mesh>}
 */
export class MeshAssets extends Assets { }

/**
 * @augments {Assets<BasicMaterial>}
 */
export class BasicMaterialAssets extends Assets { }

/**
 * @augments {Assets<Image>}
 */
export class ImageAssets extends Assets { }