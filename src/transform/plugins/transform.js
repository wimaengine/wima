import {
    Position2D,
    Orientation2D,
    Scale2D,
    GlobalTransform2D,
    Position3D,
    Orientation3D,
    Scale3D,
    GlobalTransform3D
} from '../components/index.js'
import { App, AppSchedule, Plugin } from '../../app/index.js'
import { synctransform2D, synctransform3D } from '../systems/index.js'

export class Transform2DPlugin extends Plugin {
    /**
     * @param {App} app
     */
    register(app) {
        app
            .registerType(Position2D)
            .registerType(Orientation2D)
            .registerType(Scale2D)
            .registerType(GlobalTransform2D)
            .registerSystem(AppSchedule.Update, synctransform2D)
    }
}

export class Transform3DPlugin extends Plugin {

    /**
     * @param {App} app
     */
    register(app) {
        app
            .registerType(Position3D)
            .registerType(Orientation3D)
            .registerType(Scale3D)
            .registerType(GlobalTransform3D)
            .registerSystem(AppSchedule.Update, synctransform3D)

    }
}