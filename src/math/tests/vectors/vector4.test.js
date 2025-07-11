import { test, describe } from "node:test";
import { Vector4 } from "../../vector4.js";
import { deepStrictEqual, strictEqual } from "node:assert";

describe("Testing `Vector4`", () => {
    test("`Vector4` default constructor is zero", () => {
        const vector = new Vector4()
        const expected = new Vector4(0, 0, 0, 0)

        deepStrictEqual(vector, expected)
    })

    test("`Vector4.copy` copies correctly", () => {
        const vector = new Vector4(1, 2, 3, 4)
        const expected = Vector4.copy(vector)

        deepStrictEqual(vector, expected)
    })

    test("`Vector4.set` sets correctly", () => {
        const vector = Vector4.set(1, 2, 3, 4)
        const expected = new Vector4(1, 2, 3, 4)

        deepStrictEqual(vector, expected)
    })

    test("`Vector4.splat` splats correctly", () => {
        const vector = Vector4.splat(1)
        const expected = new Vector4(1, 1, 1, 1)

        deepStrictEqual(vector, expected)
    })

    test("`Vector4.normalize` returns a unit vector", () => {
        const vector = new Vector4(0, 0, 0, 1)
        const normalized = Vector4.normalize(vector)

        strictEqual(Vector4.magnitude(normalized), 1)
    })

    test("`Vector4.normalize` preserves direction", () => {
        const vector = new Vector4(0, 10, 0, 0)
        const expected = new Vector4(0, 1, 0, 0)
        const actual = Vector4.normalize(vector)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.setMagnitude` sets length correctly", () => {
        const vector = new Vector4(3, 6, 7, 34)
        const actual = Vector4.setMagnitude(vector, 10)

        deepStrictEqual(Vector4.magnitude(actual), 10)
    })

    test("`Vector4.setMagnitude` preserves direction", () => {
        const vector = new Vector4(0, 1, 0, 0)
        const expected = new Vector4(0, 10, 0, 0)
        const actual = Vector4.setMagnitude(vector, 10)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.magnitudeSquared` operates correctly", () => {
        const operand = new Vector4(3, 4, 0, 0)

        deepStrictEqual(Vector4.magnitudeSquared(operand), 25)
    })

    test("`Vector4.magnitude` operates correctly", () => {
        const operand = new Vector4(3, 4, 0, 0)

        deepStrictEqual(Vector4.magnitude(operand), 5)
    })

    test("`Vector4.distanceToSquared` operates correctly", () => {
        const from = new Vector4(5, 3, 0, 0)
        const to = new Vector4(10, 15, 0, 0)

        deepStrictEqual(Vector4.distanceToSquared(from, to), 169)
    })

    test("`Vector4.distanceTo` operates correctly", () => {
        const from = new Vector4(5, 3, 0, 0)
        const to = new Vector4(10, 15, 0, 0)

        deepStrictEqual(Vector4.distanceTo(from, to), 13)
    })

    test("`Vector4.add` operates correctly", () => {
        const operand1 = new Vector4(1, 2, 3, 4)
        const operand2 = new Vector4(1, 2, 3, 4)
        const expected = new Vector4(2, 4, 6, 8)
        const actual = Vector4.add(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.addScalar` operates correctly", () => {
        const operand1 = new Vector4(1, 2, 3, 5)
        const expected = new Vector4(2, 3, 4, 6)
        const actual = Vector4.addScalar(operand1, 1)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.subtract` operates correctly", () => {
        const operand1 = new Vector4(1, 2, 3, 4)
        const operand2 = new Vector4(1, 2, 3, 4)
        const expected = new Vector4(0, 0, 0)
        const actual = Vector4.subtract(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.subtractScalar` operates correctly", () => {
        const operand1 = new Vector4(3, 5, 7, 8)
        const expected = new Vector4(2, 4, 6, 7)
        const actual = Vector4.subtractScalar(operand1, 1)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.multiply` operates correctly", () => {
        const operand1 = new Vector4(2, 4, 6, 5)
        const operand2 = new Vector4(2, 4, 8, 7)
        const expected = new Vector4(4, 16, 48, 35)
        const actual = Vector4.multiply(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.multiplyScalar` operates correctly", () => {
        const operand1 = new Vector4(3, 5, 7, 10)
        const expected = new Vector4(9, 15, 21, 30)
        const actual = Vector4.multiplyScalar(operand1, 3)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.divide` operates correctly", () => {
        const operand1 = new Vector4(4, 6, 18, 40)
        const operand2 = new Vector4(2, 3, 9, 20)
        const expected = new Vector4(2, 2, 2, 2)
        const actual = Vector4.divide(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.divideScalar` operates correctly", () => {
        const operand1 = new Vector4(6, 15, 24, 30)
        const expected = new Vector4(2, 5, 8, 10)
        const actual = Vector4.divideScalar(operand1, 3)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.reverse` operates correctly", () => {
        const operand = new Vector4(4, 6, -8, 5)
        const expected = new Vector4(-4, -6, 8, -5)
        const actual = Vector4.reverse(operand)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.invert` operates correctly", () => {
        const vector = new Vector4(0.5, 0.5, 0.25, -0.25)
        const expected = new Vector4(2, 2, 4, -4)
        const actual = Vector4.invert(vector)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.dot` operates correctly", () => {
        const operand1 = new Vector4(1, 2, 9, 8)
        const operand2 = new Vector4(3, 4, 7, 6)

        deepStrictEqual(Vector4.dot(operand1, operand2), 122)
    })

    test("`Vector4.lerp` operates correctly", () => {
        const operand1 = new Vector4(10, 10, 10, 50)
        const operand2 = new Vector4(20, 20, 20, 30)
        const expected = new Vector4(15, 15, 15, 40)
        const actual = Vector4.lerp(operand1, operand2, 0.5)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.reflect` operates correctly (case 1)", () => {
        const incident = new Vector4(0, -1, 0, 0)
        const normal = new Vector4(0, 1, 0, 0)
        const expected = new Vector4(0, 1, 0, 0)
        const actual = Vector4.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.reflect` operates correctly (case 2)", () => {
        const incident = new Vector4(10, 0, 0, 0)
        const normal = new Vector4(0, 1, 0, 0)
        const expected = new Vector4(10, 0, 0, 0)
        const actual = Vector4.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.reflect` operates correctly (case 3)", () => {
        const incident = new Vector4(0, 10, 0, 0)
        const normal = new Vector4(0, 1, 0, 0)
        const expected = new Vector4(0, -10, 0, 0)
        const actual = Vector4.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.reflect` operates correctly (case 4)", () => {
        const incident = new Vector4(0, 10, 0, 0)
        const normal = new Vector4(0, 0, 1, 0)
        const expected = new Vector4(0, 10, 0, 0)
        const actual = Vector4.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.reflect` operates correctly (case 5)", () => {
        const incident = new Vector4(10, 0, 0, 0)
        const normal = new Vector4(0, 0, -1, 0)
        const expected = new Vector4(10, 0, 0, 0)
        const actual = Vector4.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector4.equal` checks equality correctly", () => {
        const vector1 = new Vector4(2, 5, 8, 3)
        const vector2 = new Vector4(2, 5, 8, 3)

        strictEqual(Vector4.equal(vector1, vector2), true)
    })
})