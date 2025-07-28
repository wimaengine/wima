import { test, describe } from "node:test";
import { Vector2 } from "../../index.js";
import { deepStrictEqual, strictEqual } from "node:assert";

describe("Testing `Vector2`", () => {
    test("`Vector2` default constructor is zero", () => {
        const vector = new Vector2()
        const expected = new Vector2(0, 0)

        deepStrictEqual(vector, expected)
    })

    test("`Vector2.copy` copies correctly", () => {
        const vector = new Vector2(1, 5)
        const expected = Vector2.copy(vector)

        deepStrictEqual(vector, expected)
    })

    test("`Vector2.set` sets correctly", () => {
        const vector = Vector2.set(1, 2)
        const expected = new Vector2(1, 2)

        deepStrictEqual(vector, expected)
    })

    test("`Vector2.splat` splats correctly", () => {
        const vector = Vector2.splat(1)
        const expected = new Vector2(1, 1)

        deepStrictEqual(vector, expected)
    })

    test("`Vector2.normalize` returns a unit vector", () => {
        const vector = new Vector2(1, 0)
        const normalized = Vector2.normalize(vector)

        strictEqual(Vector2.magnitude(normalized), 1)
    })

    test("`Vector2.normalize` preserves direction", () => {
        const vector = new Vector2(10, 0)
        const expected = new Vector2(1, 0)
        const actual = Vector2.normalize(vector)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.setMagnitude` sets length correctly", () => {
        const vector = new Vector2(4, 5)
        const actual = Vector2.setMagnitude(vector,10)

        deepStrictEqual(Vector2.magnitude(actual), 10)
    })

    test("`Vector2.setMagnitude` preserves direction", () => {
        const vector = new Vector2(1, 0)
        const expected = new Vector2(10, 0)
        const actual = Vector2.setMagnitude(vector,10)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.magnitudeSquared` operates correctly", () => {
        const operand = new Vector2(3, 4)

        deepStrictEqual(Vector2.magnitudeSquared(operand), 25)
    })

    test("`Vector2.magnitude` operates correctly", () => {
        const operand = new Vector2(3, 4)

        deepStrictEqual(Vector2.magnitude(operand), 5)
    })

    test("`Vector2.distanceToSquared` operates correctly", () => {
        const from = new Vector2(5, 3)
        const to = new Vector2(10, 15)

        deepStrictEqual(Vector2.distanceToSquared(from, to), 169)
    })

    test("`Vector2.distanceTo` operates correctly", () => {
        const from = new Vector2(5, 3)
        const to = new Vector2(10, 15)

        deepStrictEqual(Vector2.distanceTo(from, to), 13)
    })

    test("`Vector2.add` operates correctly", () => {
        const operand1 = new Vector2(1, 1)
        const operand2 = new Vector2(1, 1)
        const expected = new Vector2(2, 2)
        const actual = Vector2.add(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.addScalar` operates correctly", () => {
        const operand1 = new Vector2(1, 1)
        const expected = new Vector2(2, 2)
        const actual = Vector2.addScalar(operand1, 1)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.subtract` operates correctly", () => {
        const operand1 = new Vector2(1, 1)
        const operand2 = new Vector2(1, 1)
        const expected = new Vector2(0, 0)
        const actual = Vector2.subtract(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.subtractScalar` operates correctly", () => {
        const operand1 = new Vector2(3, 5)
        const expected = new Vector2(2, 4)
        const actual = Vector2.subtractScalar(operand1, 1)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.multiply` operates correctly", () => {
        const operand1 = new Vector2(2, 4)
        const operand2 = new Vector2(2, 4)
        const expected = new Vector2(4, 16)
        const actual = Vector2.multiply(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.multiplyScalar` operates correctly", () => {
        const operand1 = new Vector2(3, 5)
        const expected = new Vector2(9, 15)
        const actual = Vector2.multiplyScalar(operand1, 3)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.divide` operates correctly", () => {
        const operand1 = new Vector2(4, 6)
        const operand2 = new Vector2(2, 3)
        const expected = new Vector2(2, 2)
        const actual = Vector2.divide(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.divideScalar` operates correctly", () => {
        const operand1 = new Vector2(6, 15)
        const expected = new Vector2(2, 5)
        const actual = Vector2.divideScalar(operand1, 3)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.reverse` operates correctly", () => {
        const operand = new Vector2(4, 6)
        const expected = new Vector2(-4, -6)
        const actual = Vector2.reverse(operand)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.invert` operates correctly", () => {
        const vector = new Vector2(0.5, 0.5)
        const expected = new Vector2(2, 2)
        const actual = Vector2.invert(vector)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.dot` operates correctly", () => {
        const operand1 = new Vector2(1, 2)
        const operand2 = new Vector2(3, 4)

        deepStrictEqual(Vector2.dot(operand1,operand2), 11)
    })

    test("`Vector2.cross` operates correctly", () => {
        const operand1 = new Vector2(1, 2)
        const operand2 = new Vector2(3, 4)

        deepStrictEqual(Vector2.cross(operand1,operand2), -2)
    })

    test("`Vector2.lerp` operates correctly", () => {
        const operand1 = new Vector2(10, 10)
        const operand2 = new Vector2(20, 20)
        const expected = new Vector2(15, 15)
        const actual = Vector2.lerp(operand1, operand2,0.5)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.reflect` operates correctly (case 1)", () => {
        const incident = new Vector2(0, -1)
        const normal = new Vector2(0, 1)
        const expected = new Vector2(0, 1)
        const actual = Vector2.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.reflect` operates correctly (case 2)", () => {
        const incident = new Vector2(10,0)
        const normal = new Vector2(0, 1)
        const expected = new Vector2(10, 0)
        const actual = Vector2.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.reflect` operates correctly (case 3)", () => {
        const incident = new Vector2(0, 10)
        const normal = new Vector2(0, 1)
        const expected = new Vector2(0, -10)
        const actual = Vector2.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector2.equal` checks equality correctly", () => {
        const vector1 = new Vector2(2, 5)
        const vector2 = new Vector2(2, 5)

        strictEqual(Vector2.equal(vector1, vector2), true)
    })
})