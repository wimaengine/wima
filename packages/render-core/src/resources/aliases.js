import { Assets } from '@wimaengine/asset'
import { BasicMaterial, Mesh, Image } from '../assets'

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
