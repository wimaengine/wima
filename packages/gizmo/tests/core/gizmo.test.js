import { describe, expect, test } from 'vitest'
import { Color } from '@wimaengine/color'
import { Affine2, Rotary, Vector2 } from '@wimaengine/math'
import { Gizmo2D, GizmoBuffer, GizmoSettings, GizmoTextAlign } from '../../src/core/index.js'

class TestGizmo { }

describe('GizmoBuffer', () => {
  test('clears filled triangle-fan data with the other buffers', () => {
    const buffer = new GizmoBuffer()
    buffer.fillPositions.push(new Vector2(0, 0))
    buffer.fillColors.push(Color.WHITE)
    buffer.texts.push('text')
    buffer.textAffines.push(new Affine2())
    buffer.textColors.push(Color.WHITE)
    buffer.textAlignments.push(GizmoTextAlign.Center)
    buffer.textSizes.push(12)
    buffer.fillTexts.push('fill text')
    buffer.fillTextAffines.push(new Affine2())
    buffer.fillTextColors.push(Color.WHITE)
    buffer.fillTextAlignments.push(GizmoTextAlign.Right)
    buffer.fillTextSizes.push(14)

    buffer.clear()

    expect(buffer.fillPositions).toHaveLength(0)
    expect(buffer.fillColors).toHaveLength(0)
    expect(buffer.texts).toHaveLength(0)
    expect(buffer.textAffines).toHaveLength(0)
    expect(buffer.textColors).toHaveLength(0)
    expect(buffer.textAlignments).toHaveLength(0)
    expect(buffer.textSizes).toHaveLength(0)
    expect(buffer.fillTexts).toHaveLength(0)
    expect(buffer.fillTextAffines).toHaveLength(0)
    expect(buffer.fillTextColors).toHaveLength(0)
    expect(buffer.fillTextAlignments).toHaveLength(0)
    expect(buffer.fillTextSizes).toHaveLength(0)
  })
})

describe('Gizmo2D transforms', () => {
  test('mutates the existing affine for transform helpers', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())
    const transformation = gizmo.transformation

    gizmo
      .setTransform(new Affine2(1, 0, 2, 0, 1, 3))
      .transform(new Affine2())
      .translate(4, 5)
      .rotate(Math.PI / 2)
      .scale(2, 3)

    expect(gizmo.transformation).toBe(transformation)
    expect(transformation.x).toBeCloseTo(-8)
    expect(transformation.y).toBeCloseTo(6)
    expect(transformation.a).toBeCloseTo(0)
    expect(transformation.b).toBeCloseTo(2)
    expect(transformation.c).toBeCloseTo(-3)
    expect(transformation.d).toBeCloseTo(0)
  })

  test('composes into the existing affine', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())
    const transformation = gizmo.transformation

    gizmo.compose(new Vector2(2, 3), Rotary.fromAngle(Math.PI / 2), new Vector2(4, 5))

    expect(gizmo.transformation).toBe(transformation)
    expect(transformation.x).toBeCloseTo(2)
    expect(transformation.y).toBeCloseTo(3)
    expect(transformation.a).toBeCloseTo(0)
    expect(transformation.b).toBeCloseTo(4)
    expect(transformation.c).toBeCloseTo(-5)
    expect(transformation.d).toBeCloseTo(0)
  })
})

describe('Gizmo2D shapes', () => {
  test('captures text with a copy of the current transform', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())

    gizmo
      .translate(4, 5)
      .text('outline', Color.WHITE, GizmoTextAlign.Center, 12)
      .fillText('fill', Color.WHITE, GizmoTextAlign.Right, 14)
    gizmo.translate(2, 3)

    expect(gizmo.buffer.texts).toEqual(['outline'])
    expect(gizmo.buffer.textAffines[0]).not.toBe(gizmo.transformation)
    expect(gizmo.buffer.textAffines[0].x).toBeCloseTo(4)
    expect(gizmo.buffer.textAffines[0].y).toBeCloseTo(5)
    expect(gizmo.buffer.textAlignments[0]).toBe(GizmoTextAlign.Center)
    expect(gizmo.buffer.textSizes[0]).toBe(12)
    expect(gizmo.buffer.fillTexts).toEqual(['fill'])
    expect(gizmo.buffer.fillTextAffines[0].x).toBeCloseTo(4)
    expect(gizmo.buffer.fillTextAffines[0].y).toBeCloseTo(5)
    expect(gizmo.buffer.fillTextAlignments[0]).toBe(GizmoTextAlign.Right)
    expect(gizmo.buffer.fillTextSizes[0]).toBe(14)
  })

  test('uses mesh triangle dimensions and base ratio', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())

    gizmo.triangle(4, 2, 0.5, Color.WHITE)

    expect(gizmo.buffer.polylinePositions[0].x).toBeCloseTo(-2)
    expect(gizmo.buffer.polylinePositions[0].y).toBeCloseTo(-1)
    expect(gizmo.buffer.polylinePositions[1].x).toBeCloseTo(2)
    expect(gizmo.buffer.polylinePositions[1].y).toBeCloseTo(-1)
    expect(gizmo.buffer.polylinePositions[2].x).toBeCloseTo(1)
    expect(gizmo.buffer.polylinePositions[2].y).toBeCloseTo(1)
    expect(gizmo.buffer.polylinePositions[3]).toEqual(gizmo.buffer.polylinePositions[0])
  })

  test('draws a centered rectangle outline', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())

    gizmo.rect(4, 2, Color.WHITE)

    expect(gizmo.buffer.polylinePositions[0]).toMatchObject({ x: -4, y: -2 })
    expect(gizmo.buffer.polylinePositions[1]).toMatchObject({ x: -4, y: 2 })
    expect(gizmo.buffer.polylinePositions[2]).toMatchObject({ x: 4, y: 2 })
    expect(gizmo.buffer.polylinePositions[3]).toMatchObject({ x: 4, y: -2 })
    expect(gizmo.buffer.polylinePositions[4]).toMatchObject({ x: -4, y: -2 })
  })

  test('draws a closed polygon outline', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())
    const vertices = [new Vector2(-1, -1), new Vector2(1, -1), new Vector2(0, 1)]

    gizmo.polygon(vertices, Color.WHITE)

    expect(gizmo.buffer.polylinePositions).toHaveLength(5)
    expect(gizmo.buffer.polylinePositions[3]).toEqual(vertices[0])
  })

  test('draws a sector from the origin through the arc and back', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())

    gizmo.sector(0, Math.PI / 2, 2, 2, Color.WHITE, 2)

    expect(gizmo.buffer.polylinePositions).toHaveLength(6)
    expect(gizmo.buffer.polylinePositions[0]).toMatchObject({ x: 0, y: 0 })
    expect(gizmo.buffer.polylinePositions[1].x).toBeCloseTo(2)
    expect(gizmo.buffer.polylinePositions[3].x).toBeCloseTo(0)
    expect(gizmo.buffer.polylinePositions[3].y).toBeCloseTo(2)
    expect(gizmo.buffer.polylinePositions[4]).toMatchObject({ x: 0, y: 0 })
  })

  test('draws a capsule along the local Y axis', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())

    gizmo.capsule(1, 2, Color.WHITE, 2)

    expect(gizmo.buffer.polylinePositions).toHaveLength(8)
    expect(gizmo.buffer.polylinePositions[0]).toMatchObject({ x: 1, y: -2 })
    expect(gizmo.buffer.polylinePositions[1]).toMatchObject({ x: 1, y: 2 })
    expect(gizmo.buffer.polylinePositions[3]).toMatchObject({ x: -1, y: 2 })
    expect(gizmo.buffer.polylinePositions[6].x).toBeCloseTo(1)
    expect(gizmo.buffer.polylinePositions[6].y).toBeCloseTo(-2)
  })

  test('draws an arrow with a triangular head without mutating its direction', () => {
    const gizmo = new Gizmo2D(TestGizmo, new GizmoSettings())
    const direction = new Vector2(1, 0)

    gizmo.arrow(direction, 10, Color.WHITE)

    expect(direction.x).toBe(1)
    expect(direction.y).toBe(0)
    expect(gizmo.buffer.positions).toHaveLength(0)
    expect(gizmo.buffer.polylinePositions).toHaveLength(7)
    expect(gizmo.buffer.polylinePositions[0].x).toBeCloseTo(0)
    expect(gizmo.buffer.polylinePositions[1].x).toBeCloseTo(7.5)
    expect(gizmo.buffer.polylinePositions[2].y).toBeCloseTo(1.5)
    expect(gizmo.buffer.polylinePositions[3].x).toBeCloseTo(10)
    expect(gizmo.buffer.polylinePositions[4].y).toBeCloseTo(-1.5)
    expect(gizmo.buffer.polylinePositions[5]).toEqual(gizmo.buffer.polylinePositions[1])
  })
})
