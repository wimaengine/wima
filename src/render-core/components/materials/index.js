import { BasicMaterial } from '../../assets/index.js'
import { Material2D, Material3D } from '../material.js'

/**
 * @augments Material2D<BasicMaterial>
 */
export class BasicMaterial2D extends Material2D {
    /**
     * @param {BasicMaterial2D} source
     * @param {BasicMaterial2D} target
     */
    static copy(source, target = new BasicMaterial2D(source.handle)) {
        target.handle = source.handle.clone()

        return target
    }

    /**
     * @param {BasicMaterial2D} target
     */
    static clone(target) {
        return BasicMaterial2D.copy(target)
    }
}
/**
 * @augments Material3D<BasicMaterial>
 */
export class BasicMaterial3D extends Material3D {

    /**
     * @param {BasicMaterial3D} source
     * @param {BasicMaterial3D} target
     */
    static copy(source, target = new BasicMaterial3D(source.handle)) {
        target.handle = source.handle.clone()

        return target
    }

    /**
     * @param {BasicMaterial3D} target
     */
    static clone(target) {
        return BasicMaterial3D.copy(target)
    }
}
