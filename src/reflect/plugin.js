import { App, Plugin } from "../app/index.js";
import { TypeRegistry } from "./core/typeregistry.js";

export class ReflectPlugin extends Plugin {
    /**
     * @param {App} app
     */
    register(app){
        app.setResource(new TypeRegistry())
    }
}