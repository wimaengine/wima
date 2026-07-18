import { Events } from "@wimaengine/event"
import { typeidGeneric } from "@wimaengine/type"
import { EntityHandle, Query, World } from "@wimaengine/ecs"
import { Window, Windows, WindowResize } from "@wimaengine/window"


/**
 * @param {World} world 
 */
export function resizeWindow(world) {
    const windows = new Query(world, [EntityHandle, Window])
    const canvases = world.getResource(Windows)
    /** @type {Events<WindowResize>} */
    const dispatch = world.getResourceByTypeId(typeidGeneric(Events, [WindowResize]))

    windows.each(([entity, window]) => {
        const canvas = canvases.getWindow(entity)

        if (!(canvas instanceof HTMLCanvasElement)) {
            return
        }

        const rect = canvas.getBoundingClientRect()

        if (rect.width === window.getWidth() || rect.height === window.getHeight()) {
            return
        }

        window.set(rect.width, rect.height)
        dispatch.write(new WindowResize(rect.width, rect.height))
    })
}