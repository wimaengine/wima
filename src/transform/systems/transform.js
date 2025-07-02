import { Query,World } from "../../ecs/index.js"
import { Position3D, Orientation3D, Scale3D, GlobalTransform3D } from "../components/index.js"


/**
 * @param {World} world
 */
export function synctransform3D(world) {
    const query = new Query(world, [Position3D, Orientation3D, Scale3D, GlobalTransform3D])

    query.each(([position, orientation, scale, transform]) => {
        transform.compose(position, orientation, scale)
    })
}