/** @import {Entity} from 'wima' */
import {
  World,
  Color,
  Demo,
  Vector2,
  GizmoLineStyle
} from 'wima'
import { Demo1Gizmo2D, Demo2Gizmo2D } from '../utils.js'

export default new Demo('gizmo2d/line style', [init], [update])

/**
 * @param {World} world
 */
function init(world) {
  const solidgizmo = world.getResource(Demo1Gizmo2D)
  const dashedgizmo = world.getResource(Demo2Gizmo2D)

  solidgizmo.settings.lineWidth = 5
  solidgizmo.settings.lineStyle = GizmoLineStyle.Solid
  dashedgizmo.settings.lineWidth = 5
  dashedgizmo.settings.lineStyle = GizmoLineStyle.Dashed

}

/**
 * @param {World} world
 */
function update(world) {
  const solidgizmo = world.getResource(Demo1Gizmo2D)
  const dashedgizmo = world.getResource(Demo2Gizmo2D)

  solidgizmo
    .line(new Vector2(100, 100), new Vector2(500, 100), new Color(0.5, 0.5, 0.5, 1))
    .line(new Vector2(100, 200), new Vector2(500, 200), new Color(1, 0, 0, 1))
    .line(new Vector2(100, 300), new Vector2(500, 300), new Color(1, 1, 0, 1))
    .line(new Vector2(100, 400), new Vector2(500, 400), new Color(0, 1, 0, 1))
    .line(new Vector2(100, 500), new Vector2(500, 500), new Color(0, 1, 1, 1))
    .line(new Vector2(100, 600), new Vector2(500, 600), new Color(0, 0, 1, 1))
    .line(new Vector2(100, 700), new Vector2(500, 700), new Color(1, 1, 1, 1))

  dashedgizmo
    .line(new Vector2(100, 150), new Vector2(500, 150), new Color(0.5, 0.5, 0.5, 1))
    .line(new Vector2(100, 250), new Vector2(500, 250), new Color(1, 0, 0, 1))
    .line(new Vector2(100, 350), new Vector2(500, 350), new Color(1, 1, 0, 1))
    .line(new Vector2(100, 450), new Vector2(500, 450), new Color(0, 1, 0, 1))
    .line(new Vector2(100, 550), new Vector2(500, 550), new Color(0, 1, 1, 1))
    .line(new Vector2(100, 650), new Vector2(500, 650), new Color(0, 0, 1, 1))
    .line(new Vector2(100, 750), new Vector2(500, 750), new Color(1, 1, 1, 1))
}