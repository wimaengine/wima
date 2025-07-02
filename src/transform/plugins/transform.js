import {
    Position2D,
    Orientation2D,
    Scale2D,
    GlobalTransform2D,
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