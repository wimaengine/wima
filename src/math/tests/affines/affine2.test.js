import { test, describe } from "node:test";
import { Affine2 } from "../../affine2.js";
import { Vector2 } from "../../vector2.js";
import { deepStrictEqual, strictEqual } from "node:assert";
import { Rotary } from "../../rotary.js";

describe("Testing `Affine2`", () => {
    test('`Affine2` constructor is correct', () => {
        const affine = new Affine2(
            1, 2, 3,
            4, 5, 6
        )
        strictEqual(affine.a, 1)
        strictEqual(affine.b, 4)
        strictEqual(affine.c, 2)
        strictEqual(affine.d, 5)
        strictEqual(affine.x, 3)
        strictEqual(affine.y, 6)
    })

    test('`Affine2` default constructor is identity', () => {
        const affine = new Affine2()
        const expected = new Affine2(
            1, 0, 0,
            0, 1, 0,
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.copy` actually copies", () => {
        const source = new Affine2(
            1, 2, 5,
            3, 4, 6
        )
        const destination = Affine2.copy(source)

        deepStrictEqual(destination, source)
    })

    test("`Affine2.set` sets values corrrectly", () => {
        const expected = new Affine2(
            1, 2, 5,
            3, 4, 6
        )
        const actual = Affine2.set(
            1, 2, 5,
            3, 4, 6
        )

        deepStrictEqual(actual, expected)
    })

    test('`Affine2.identity` is identity', () => {
        const actual = Affine2.identity()
        const expected = new Affine2(
            1, 0, 0,
            0, 1, 0
        )
        deepStrictEqual(actual, expected)
    })

    test('`Affine2.zero` is zero', () => {
        const actual = Affine2.zero()
        const expected = new Affine2(
            0, 0, 0,
            0, 0, 0
        )
        deepStrictEqual(actual, expected)
    })

    test("`Affine2.lookAt()` from origin to positive x-axis", () => {
        const eye = new Vector2()
        const target = new Vector2(1)
        const affine = Affine2.lookAt(eye, target)

        const [position, orientation, scale] = affine.decompose()

        deepStrictEqual(position, new Vector2())
        deepStrictEqual(orientation, new Rotary(1, 0))
        deepStrictEqual(scale, new Vector2(1, 1))
    })

    test("`Affine2.lookAt()` from origin to positive y-axis", () => {
        const eye = new Vector2()
        const target = new Vector2(0, 1)
        const affine = Affine2.lookAt(eye, target)

        const [position, orientation, scale] = affine.decompose()

        deepStrictEqual(position, new Vector2())
        deepStrictEqual(orientation, new Rotary(0, 1))
        deepStrictEqual(scale, new Vector2(1, 1))
    })

    test("`Affine2.lookAt()` from origin to negative x-axis", () => {
        const eye = new Vector2()
        const target = new Vector2(-1, 0)
        const affine = Affine2.lookAt(eye, target)

        const [position, orientation, scale] = affine.decompose()

        deepStrictEqual(position, new Vector2())
        deepStrictEqual(orientation, new Rotary(-1, 0))
        deepStrictEqual(scale, new Vector2(1, 1))
    })

    test("`Affine2.lookAt()` from origin to negative y-axis", () => {
        const eye = new Vector2()
        const target = new Vector2(0, -1)
        const affine = Affine2.lookAt(eye, target)

        const [position, orientation, scale] = affine.decompose()

        deepStrictEqual(position, new Vector2())
        deepStrictEqual(orientation, new Rotary(0, -1))
        deepStrictEqual(scale, new Vector2(1, 1))
    })

    test("`Affine2.lookAt()` from known position to up.", () => {
        const eye = new Vector2(10, 10)
        const target = new Vector2(10, 11)
        const affine = Affine2.lookAt(eye, target)

        const [position, orientation, scale] = affine.decompose()

        deepStrictEqual(position, new Vector2(10, 10))
        deepStrictEqual(orientation, new Rotary(0, 1))
        deepStrictEqual(scale, new Vector2(1, 1))
    })

    test("`Affine2.lookAt()` eye and target on same position.", () => {
        const eye = new Vector2()
        const target = new Vector2()
        const affine = Affine2.lookAt(eye, target)

        const [position, orientation, scale] = affine.decompose()

        deepStrictEqual(position, new Vector2())
        deepStrictEqual(orientation, new Rotary(1, 0))
        deepStrictEqual(scale, new Vector2(1, 1))
    })

    test("`Affine2.compose()` operates correctly (normal scale).", () => {
        const position = new Vector2(100, 200)
        const orientation = new Rotary(1, 0)
        const scale = new Vector2(1, 1)
        const affine = Affine2.compose(position, orientation, scale)
        const expected = new Affine2(
            1, -0, 100,
            0, 1, 200
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.compose()` operates correctly (uniform scale).", () => {
        const position = new Vector2(100, 200)
        const orientation = new Rotary(1, 0)
        const scale = new Vector2(4, 4)
        const affine = Affine2.compose(position, orientation, scale)
        const expected = new Affine2(
            4, -0, 100,
            0, 4, 200
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.compose()` operates correctly (non-uniform scale).", () => {
        const position = new Vector2(100, 200)
        const orientation = new Rotary(1, 0)
        const scale = new Vector2(3, 2)
        const affine = Affine2.compose(position, orientation, scale)
        const expected = new Affine2(
            3, -0, 100,
            0, 2, 200
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.compose()` operates correctly (rotated to negative x-axis).", () => {
        const position = new Vector2(100, 200)
        const orientation = new Rotary(-1, 0)
        const scale = new Vector2(1, 1)
        const affine = Affine2.compose(position, orientation, scale)
        const expected = new Affine2(
            -1, -0, 100,
            0, -1, 200
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.compose()` operates correctly (rotated to positive y-axis).", () => {
        const position = new Vector2(100, 200)
        const orientation = new Rotary(0, 1)
        const scale = new Vector2(1, 1)
        const affine = Affine2.compose(position, orientation, scale)
        const expected = new Affine2(
            0, -1, 100,
            1, 0, 200
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.compose()` operates correctly (rotated to negative y-axis).", () => {
        const position = new Vector2(100, 200)
        const orientation = new Rotary(0, -1)
        const scale = new Vector2(1, 1)
        const affine = Affine2.compose(position, orientation, scale)
        const expected = new Affine2(
            0, 1, 100,
            -1, 0, 200
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.compose()` operates correctly (rotated and large uniform scale).", () => {
        const position = new Vector2(100, 200)
        const orientation = new Rotary(0, -1)
        const scale = new Vector2(100, 100)
        const affine = Affine2.compose(position, orientation, scale)
        const expected = new Affine2(
            0, 100, 100,
            -100, 0, 200
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine2.decompose()` operates correctly (case 1).", () => {
        const affine = new Affine2(
            1, 0, 100,
            0, 1, 200
        )
        const [position, orientation, scale] = Affine2.decompose(affine)

        deepStrictEqual(position, new Vector2(100, 200))
        deepStrictEqual(orientation, new Rotary(1, 0))
        deepStrictEqual(scale, new Vector2(1, 1))
    })

    test("`Affine2.decompose()` operates correctly (case 2).", () => {
        const affine = new Affine2(
            5, 0, 100,
            0, 3, 200
        )
        const [position, orientation, scale] = Affine2.decompose(affine)

        deepStrictEqual(position, new Vector2(100, 200))
        deepStrictEqual(orientation, new Rotary(1, 0))
        deepStrictEqual(scale, new Vector2(5, 3))
    })

    test("`Affine2.decompose()` operates correctly (case 3).", () => {
        const affine = new Affine2(
            0, -5, 100,
            3, 0, 200
        )
        const [position, orientation, scale] = Affine2.decompose(affine)

        deepStrictEqual(position, new Vector2(100, 200))
        deepStrictEqual(orientation, new Rotary(0, 1))
        deepStrictEqual(scale, new Vector2(3, 5))
    })

    test("`Affine2.translate()` operates correctly.", () => {
        const affine = new Affine2()
        const position = new Vector2(100, 200)
        const actual = Affine2.translate(affine, position)
        const expected = new Affine2(
            1, 0, 100,
            0, 1, 200
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine2.rotate()` operates correctly.", () => {
        const affine = new Affine2()
        const rotation = new Rotary(0, 1)
        const actual = Affine2.rotate(affine, rotation)
        const expected = new Affine2(
            0, -1, 0,
            1, 0, 0
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine2.scale()` operates correctly (case 1).", () => {
        const affine = new Affine2()
        const rotation = new Vector2(100, 100)
        const actual = Affine2.scale(affine, rotation)
        const expected = new Affine2(
            100, 0, 0,
            0, 100, 0
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine2.scale()` operates correctly (case 2).", () => {
        const affine = new Affine2().rotate(new Rotary(0, 1))
        const rotation = new Vector2(100, 100)
        const actual = Affine2.scale(affine, rotation)
        const expected = new Affine2(
            0, -100, 0,
            100, 0, 0
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine2.multiply` operates correctly (case 1)", () => {
        const operand1 = new Affine2(
            1, 0, 100,
            0, 1, 100
        )
        const operand2 = new Affine2(
            0, -1, 100,
            1, 0, 100
        )

        const expected = new Affine2(
            0, -1, 200,
            1, 0, 200
        )
        const result = Affine2.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.multiply` operates correctly (case 2)", () => {
        const operand1 = new Affine2(
            0, -1, 100,
            1, 0, 100
        )
        const operand2 = new Affine2(
            1, 0, 100,
            0, 1, 100
        )
        const expected = new Affine2(
            0, -1, 0,
            1, 0, 200
        )
        const result = Affine2.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.divide` divides correctly", () => {
        const operand1 = new Affine2(
            4, 3, 100,
            3, 2, 100
        )
        const operand2 = new Affine2(
            4, 3, 100,
            3, 2, 100
        )

        const expected = new Affine2(
            1, 0, 0,
            0, 1, 0
        )
        const result = Affine2.divide(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.invert` operates correctly (case 1)", () => {
        const affine = new Affine2(
            0, -1, 100,
            1, 0, 100
        )

        const expected = new Affine2(
            0, 1, -100,
            -1, 0, 100
        )
        const result = Affine2.invert(affine)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.invert` operates correctly (case 2)", () => {
        const affine = new Affine2(
            1, 0, 100,
            0, 1, 100
        )

        const expected = new Affine2(
            1, -0, -100,
            -0, 1, -100
        )
        const result = Affine2.invert(affine)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.transform` operates correctly (case 1)", () => {
        const affine = new Affine2(
            1, 0, 100,
            0, 1, 100
        )
        const vector = new Vector2(0, 0)
        const expected = new Vector2(100, 100)
        const result = Affine2.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.transform` operates correctly (case 2)", () => {
        const affine = new Affine2(
            0, -1, 100,
            1, 0, 100
        )
        const vector = new Vector2(100, 0)
        const expected = new Vector2(100, 200)
        const result = Affine2.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.transform` operates correctly (case 3)", () => {
        const affine = new Affine2(
            2, 0, 100,
            0, 3, 100
        )
        const vector = new Vector2(100, 0)
        const expected = new Vector2(300, 100)
        const result = Affine2.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.transform` operates correctly (case 4)", () => {
        const affine = new Affine2(
            0, -3, 100,
            2, 0, 100
        )
        const vector = new Vector2(100, 200)
        const expected = new Vector2(-500, 300)
        const result = Affine2.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine2.equal` tests equality", () => {
        const affine1 = new Affine2(
            1, 2, 5,
            3, 4, 6
        )
        const affine2 = new Affine2(
            1, 2, 5,
            3, 4, 6
        )

        strictEqual(Affine2.equal(affine1, affine2), true)
    })

    test("`Affine2.Identity` is identity", () => {
        const expected = new Affine2(
            1, 0, 0,
            0, 1, 0
        )
        deepStrictEqual(Affine2.Identity, expected)
    })

    test("`Affine2.Zero` is zero", () => {
        const expected = new Affine2(
            0, 0, 0,
            0, 0, 0
        )
        deepStrictEqual(Affine2.Zero, expected)
    })
})