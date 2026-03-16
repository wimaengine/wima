import { App, Plugin } from "../app/index.js";
import { ImmediateExecutor, RAFExecutor } from "../schedule/index.js";
import { AppSchedule } from "./core/index.js";

export class CorePlugin extends Plugin {
    /**
     * @param {App} app
     */
    register(app) {
        app.createSchedule(
            AppSchedule.Startup,
            new ImmediateExecutor()
        )
        app.createSchedule(
            AppSchedule.Update,
            new RAFExecutor()
        )
    }
}