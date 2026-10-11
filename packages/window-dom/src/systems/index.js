import { EntityHandle, Query, World } from '@wimaengine/ecs'
import { Events } from '@wimaengine/event'
import { typeidGeneric } from '@wimaengine/type'
import { Window, Windows, WindowResize } from '@wimaengine/window'

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
    const width = Math.round(rect.width)
    const height = Math.round(rect.height)

    if (width === window.getWidth() && height === window.getHeight()) {
      return
    }

    canvas.width = width
    canvas.height = height
    window.set(width, height)
    dispatch.write(new WindowResize(width, height))
  })
}
