import { test, describe } from "node:test";
import { Affine3,Vector3,Quaternion,INV_SQRT2 } from "../../core/index.js";
import { deepStrictEqual, strictEqual } from "node:assert";

describe("Testing `Affine3`", () => {
    test('`Affine3` constructor is correct', () => {
        const affine = new Affine3(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12
        )
        strictEqual(affine.a, 1)
        strictEqual(affine.b, 5)
        strictEqual(affine.c, 9)
        strictEqual(affine.d, 2)
        strictEqual(affine.e, 6)
        strictEqual(affine.f, 10)
        strictEqual(affine.g, 3)
        strictEqual(affine.h, 7)
        strictEqual(affine.i, 11)
        strictEqual(affine.x, 4)
        strictEqual(affine.y, 8)
        strictEqual(affine.z, 12)
    })

    test('`Affine3` default constructor is identity', () => {
        const affine = new Affine3()
        const expected = new Affine3(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.copy` actually copies", () => {
        const source = new Affine3(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12
        )
        const destination = Affine3.copy(source)

        deepStrictEqual(destination, source)
    })

    test("`Affine3.set` sets values corrrectly", () => {
        const expected = new Affine3(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12
        )
        const actual = Affine3.set(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12
        )

        deepStrictEqual(actual, expected)
    })

    test('`Affine3.identity` is identity', () => {
        const actual = Affine3.identity()
        const expected = new Affine3(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        )
        deepStrictEqual(actual, expected)
    })

    test('`Affine3.zero` is zero', () => {
        const actual = Affine3.zero()
        const expected = new Affine3(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
        deepStrictEqual(actual, expected)
    })

    test("`Affine3.lookAt()` from origin to positive x-axis", () => {
        const eye = new Vector3()
        const target = new Vector3(1)
        const affine = Affine3.lookAt(eye, target, Vector3.Y)

        const [position, orientation, _] = affine.decompose()

        deepStrictEqual(position, new Vector3())
        strictEqual(
            Quaternion.fuzzyEqual(
                orientation,
                new Quaternion(0, -INV_SQRT2, 0, INV_SQRT2),
                0.0005
            ),
            true
        )
    })

    test("`Affine3.lookAt()` from origin to positive y-axis", () => {
        const eye = new Vector3()
        const target = new Vector3(0, 1)
        const affine = Affine3.lookAt(eye, target, Vector3.Y)

        const [position, orientation, _] = affine.decompose()

        deepStrictEqual(position, new Vector3())
        strictEqual(
            Quaternion.fuzzyEqual(
                orientation,
                new Quaternion(INV_SQRT2, 0, 0, INV_SQRT2),
                0.0005
            ),
            true
        )
    })

    test("`Affine3.lookAt()` from origin to negative x-axis", () => {
        const eye = new Vector3()
        const target = new Vector3(-1, 0)
        const affine = Affine3.lookAt(eye, target, Vector3.Y)

        const [position, orientation, _] = affine.decompose()

        deepStrictEqual(position, new Vector3())
        strictEqual(
            Quaternion.fuzzyEqual(
                orientation,
                new Quaternion(0, INV_SQRT2, 0, INV_SQRT2),
                0.0005
            ),
            true
        )
    })

    test("`Affine3.lookAt()` from origin to negative y-axis", () => {
        const eye = new Vector3()
        const target = new Vector3(0, -1)
        const affine = Affine3.lookAt(eye, target, Vector3.Y)

        const [position, orientation, _] = affine.decompose()

        deepStrictEqual(position, new Vector3())
        strictEqual(
            Quaternion.fuzzyEqual(
                orientation,
                new Quaternion(-INV_SQRT2, 0, 0, INV_SQRT2),
                0.0005
            ),
            true
        )
    })

    test("`Affine3.lookAt()` from known position to up.", () => {
        const eye = new Vector3(10, 10)
        const target = new Vector3(10, 11)
        const affine = Affine3.lookAt(eye, target, Vector3.Y)

        const [position, orientation, _] = affine.decompose()

        deepStrictEqual(position, new Vector3(10, 10))
        strictEqual(
            Quaternion.fuzzyEqual(
                orientation,
                new Quaternion(INV_SQRT2, 0, 0, INV_SQRT2),
                0.0005
            ),
            true
        )
    })

    test("`Affine3.lookAt()` eye and target on same position.", () => {
        const eye = new Vector3()
        const target = new Vector3()
        const affine = Affine3.lookAt(eye, target, Vector3.Y)

        const [position, orientation, _] = affine.decompose()

        deepStrictEqual(position, new Vector3())
        deepStrictEqual(orientation, new Quaternion(0, 0, 0, 1))
    })

    test("`Affine3.compose()` operates correctly (normal scale).", () => {
        const position = new Vector3(100, 200, 300)
        const orientation = new Quaternion(0, 0, 0, 1)
        const scale = new Vector3(1, 1, 1)
        const affine = Affine3.compose(position, orientation, scale)
        const expected = new Affine3(
            1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, 1, 300
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.compose()` operates correctly (uniform scale).", () => {
        const position = new Vector3(100, 200, 300)
        const orientation = new Quaternion(0, 0, 0, 1)
        const scale = new Vector3(4, 4, 4)
        const affine = Affine3.compose(position, orientation, scale)
        const expected = new Affine3(
            4, 0, 0, 100,
            0, 4, 0, 200,
            0, 0, 4, 300
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.compose()` operates correctly (non-uniform scale).", () => {
        const position = new Vector3(100, 200, 300)
        const orientation = new Quaternion(0, 0, 0, 1)
        const scale = new Vector3(3, 2, 5)
        const affine = Affine3.compose(position, orientation, scale)
        const expected = new Affine3(
            3, 0, 0, 100,
            0, 2, 0, 200,
            0, 0, 5, 300
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.compose()` operates correctly (rotated).", () => {
        const position = new Vector3(100, 200, 300)
        const orientation = new Quaternion(1, 0, 0, 0)
        const scale = new Vector3(1, 1, 1)
        const affine = Affine3.compose(position, orientation, scale)
        const expected = new Affine3(
            1, 0, 0, 100,
            0, -1, 0, 200,
            0, 0, -1, 300
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.compose()` operates correctly (rotated 2).", () => {
        const position = new Vector3(100, 200, 300)
        const orientation = new Quaternion(0, 1, 0, 0)
        const scale = new Vector3(1, 1, 1)
        const affine = Affine3.compose(position, orientation, scale)
        const expected = new Affine3(
            -1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, -1, 300
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.compose()` operates correctly (rotated 3).", () => {
        const position = new Vector3(100, 200, 300)
        const orientation = new Quaternion(0, 0, 1, 0)
        const scale = new Vector3(1, 1, 1)
        const affine = Affine3.compose(position, orientation, scale)
        const expected = new Affine3(
            -1, 0, 0, 100,
            0, -1, 0, 200,
            0, 0, 1, 300
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.compose()` operates correctly (rotated and large uniform scale).", () => {
        const position = new Vector3(100, 200, 300)
        const orientation = new Quaternion(0, -1, 0, 0)
        const scale = new Vector3(100, 100, 100)
        const affine = Affine3.compose(position, orientation, scale)
        const expected = new Affine3(
            -100, -0, 0, 100,
            0, 100, -0, 200,
            0, 0, -100, 300
        )

        deepStrictEqual(affine, expected)
    })

    test("`Affine3.decompose()` operates correctly (case 1).", () => {
        const affine = new Affine3(
            1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, 1, 300
        )
        const [position, orientation, scale] = Affine3.decompose(affine)

        deepStrictEqual(position, new Vector3(100, 200, 300))
        deepStrictEqual(orientation, new Quaternion(0, 0, 0, 1))
        deepStrictEqual(scale, new Vector3(1, 1, 1))
    })

    test("`Affine3.decompose()` operates correctly (case 2).", () => {
        const affine = new Affine3(
            1, 0, 0, 100,
            0, -1, 0, 200,
            0, 0, -1, 300
        )
        const [position, orientation, scale] = Affine3.decompose(affine)

        deepStrictEqual(position, new Vector3(100, 200, 300))
        deepStrictEqual(orientation, new Quaternion(1, 0, 0, 0))
        deepStrictEqual(scale, new Vector3(1, 1, 1))
    })

    test("`Affine3.decompose()` operates correctly (case 3).", () => {
        const affine = new Affine3(
            100, 0, 0, 100,
            0, -4, 0, 200,
            0, 0, -18, 300
        )
        const [position, orientation, scale] = Affine3.decompose(affine)

        deepStrictEqual(position, new Vector3(100, 200, 300))
        deepStrictEqual(orientation, new Quaternion(1, 0, 0, 0))
        deepStrictEqual(scale, new Vector3(100, 4, 18))
    })

    test("`Affine3.translate()` operates correctly.", () => {
        const affine = new Affine3()
        const position = new Vector3(100, 200, 300)
        const actual = Affine3.translate(affine, position)
        const expected = new Affine3(
            1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, 1, 300
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine3.rotate()` operates correctly (case 1).", () => {
        const affine = new Affine3()
        const rotation = new Quaternion(1, 0, 0, 0)
        const actual = Affine3.rotate(affine, rotation)
        const expected = new Affine3(
            1, 0, 0, 0,
            0, -1, 0, 0,
            0, 0, -1, 0
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine3.rotate()` operates correctly (case 2).", () => {
        const affine = new Affine3(
            1, 0, 0, 0,
            0, -1, 0, 0,
            0, 0, -1, 0
        )
        const rotation = new Quaternion(1, 0, 0, 0)
        const actual = Affine3.rotate(affine, rotation)
        const expected = new Affine3(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine3.scale()` operates correctly (case 1).", () => {
        const affine = new Affine3()
        const scale = new Vector3(1, 1, 1)
        const actual = Affine3.scale(affine, scale)
        const expected = new Affine3(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine3.scale()` operates correctly (case 2).", () => {
        const affine = new Affine3().rotate(new Quaternion(1, 0, 0, 0))
        const scale = new Vector3(100, 10, 35)
        const actual = Affine3.scale(affine, scale)
        const expected = new Affine3(
            100, 0, 0, 0,
            0, -10, 0, 0,
            0, 0, -35, 0
        )

        deepStrictEqual(actual, expected)
    })

    test("`Affine3.multiply` operates correctly (case 1)", () => {
        const operand1 = new Affine3(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        )
        const operand2 = new Affine3(
            1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, 1, 300
        )

        const expected = new Affine3(
            1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, 1, 300
        )
        const result = Affine3.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.multiply` operates correctly (case 2)", () => {
        const operand1 = new Affine3(
            1, 0, 0, 100,
            0, -1, 0, 0,
            0, 0, -1, 0
        )
        const operand2 = new Affine3(
            -1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, -1, 300
        )
        const expected = new Affine3(
            -1, 0, 0, 200,
            0, -1, 0, -200,
            0, 0, 1, -300
        )
        const result = Affine3.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.multiply` operates correctly (case 3)", () => {
        const operand1 = new Affine3(
            3, 0, 0, 100,
            0, -2, 0, 0,
            0, 0, -10, 0
        )
        const operand2 = new Affine3(
            -1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, -1, 300
        )
        const expected = new Affine3(
            -3, 0, 0, 400,
            0, -2, 0, -400,
            0, 0, 10, -3000
        )
        const result = Affine3.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.divide` divides correctly", () => {
        const operand1 = new Affine3(
            5, 0, 0, 100,
            0, -2, 0, 0,
            0, 0, -10, 0
        )
        const operand2 = new Affine3(
            5, 0, 0, 100,
            0, -2, 0, 0,
            0, 0, -10, 0
        )

        const expected = new Affine3(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        )
        const result = Affine3.divide(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.invert` operates correctly (case 1)", () => {
        const affine = new Affine3(
            1, 0, 0, 100,
            0, 1, 0, 200,
            0, 0, 1, 300
        )

        const expected = new Affine3(
            1, 0, 0, -100,
            0, 1, 0, -200,
            0, 0, 1, -300
        )
        const result = Affine3.invert(affine)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.invert` operates correctly (case 2)", () => {
        const affine = new Affine3(
            1, 0, 0, 100,
            0, -1, 0, 200,
            0, 0, -1, -300
        )

        const expected = new Affine3(
            1, 0, 0, -100,
            0, -1, 0, 200,
            0, 0, -1, -300
        )

        const result = Affine3.invert(affine)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.transform` operates correctly (case 1)", () => {
        const affine = new Affine3(
            1, 0, 0, 100,
            0, 1, 0, 100,
            0, 0, 1, 100
        )
        const vector = new Vector3(0, 0, 0)
        const expected = new Vector3(100, 100, 100)
        const result = Affine3.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.transform` operates correctly (case 2)", () => {
        const affine = new Affine3(
            -1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, -1, 0,
        )
        const vector = new Vector3(100, 200, 300)
        const expected = new Vector3(-100, 200, -300)
        const result = Affine3.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.transform` operates correctly (case 3)", () => {
        const affine = new Affine3(
            0, -1, 0, 0,
            1, 0, 0, 0,
            0, 0, -1, 0,
        )
        const vector = new Vector3(100, 200, 300)
        const expected = new Vector3(-200, 100, -300)
        const result = Affine3.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.transform` operates correctly (case 4)", () => {
        const affine = new Affine3(
            2, 0, 0, 0,
            0, 3, 0, 0,
            0, 0, 5, 0,
        )
        const vector = new Vector3(100, 200, 300)
        const expected = new Vector3(200, 600, 1500)
        const result = Affine3.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.transform` operates correctly (case 5)", () => {
        const affine = new Affine3(
            0, 0, -10, 0,
            -4, 0, 0, 0,
            0, 5, 0, 0,
        )
        const vector = new Vector3(100, 200, 300)
        const expected = new Vector3(-3000, -400,1000)
        const result = Affine3.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.transform` operates correctly (case 6)", () => {
        const affine = new Affine3(
            0, 0, -10, 3100,
            -4, 0, 0, 500,
            0, 5, 0, -900,
        )
        const vector = new Vector3(100, 200, 300)
        const expected = new Vector3(100, 100,100)
        const result = Affine3.transform(affine, vector)

        deepStrictEqual(result, expected)
    })

    test("`Affine3.equal` tests equality", () => {
        const affine1 = new Affine3(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12
        )
        const affine2 = new Affine3(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12
        )

        strictEqual(Affine3.equal(affine1, affine2), true)
    })

    test("`Affine3.Identity` is identity", () => {
        const expected = new Affine3(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        )
        deepStrictEqual(Affine3.Identity, expected)
    })

    test("`Affine3.Zero` is zero", () => {
        const expected = new Affine3(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
        deepStrictEqual(Affine3.Zero, expected)
    })
})