import { test, describe } from "node:test";
import { Vector3 } from "../../vector3.js";
import { deepStrictEqual, strictEqual } from "node:assert";

describe("Testing `Vector3`", () => {
    test("`Vector3` default constructor is zero", () => {
        const vector = new Vector3()
        const expected = new Vector3(0, 0, 0)

        deepStrictEqual(vector, expected)
    })

    test("`Vector3.copy` copies correctly", () => {
        const vector = new Vector3(1, 2, 3)
        const expected = Vector3.copy(vector)

        deepStrictEqual(vector, expected)
    })

    test("`Vector3.set` sets correctly", () => {
        const vector = Vector3.set(1, 2, 3)
        const expected = new Vector3(1, 2, 3)

        deepStrictEqual(vector, expected)
    })

    test("`Vector3.splat` splats correctly", () => {
        const vector = Vector3.splat(1)
        const expected = new Vector3(1, 1, 1)

        deepStrictEqual(vector, expected)
    })

    test("`Vector3.normalize` returns a unit vector", () => {
        const vector = new Vector3(1, 0, 0)
        const normalized = Vector3.normalize(vector)

        strictEqual(Vector3.magnitude(normalized), 1)
    })

    test("`Vector3.normalize` preserves direction", () => {
        const vector = new Vector3(10, 0, 0)
        const expected = new Vector3(1, 0, 0)
        const actual = Vector3.normalize(vector)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.setMagnitude` sets length correctly", () => {
        const vector = new Vector3(4, 5, 0)
        const actual = Vector3.setMagnitude(vector, 10)

        deepStrictEqual(Vector3.magnitude(actual), 10)
    })

    test("`Vector3.setMagnitude` preserves direction", () => {
        const vector = new Vector3(1, 0, 0)
        const expected = new Vector3(10, 0, 0)
        const actual = Vector3.setMagnitude(vector, 10)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.magnitudeSquared` operates correctly", () => {
        const operand = new Vector3(3, 4, 0)

        deepStrictEqual(Vector3.magnitudeSquared(operand), 25)
    })

    test("`Vector3.magnitude` operates correctly", () => {
        const operand = new Vector3(3, 4, 0)

        deepStrictEqual(Vector3.magnitude(operand), 5)
    })

    test("`Vector3.distanceToSquared` operates correctly", () => {
        const from = new Vector3(5, 3, 0)
        const to = new Vector3(10, 15, 0)

        deepStrictEqual(Vector3.distanceToSquared(from, to), 169)
    })

    test("`Vector3.distanceTo` operates correctly", () => {
        const from = new Vector3(5, 3, 0)
        const to = new Vector3(10, 15, 0)

        deepStrictEqual(Vector3.distanceTo(from, to), 13)
    })

    test("`Vector3.add` operates correctly", () => {
        const operand1 = new Vector3(1, 2, 3)
        const operand2 = new Vector3(1, 2, 3)
        const expected = new Vector3(2, 4, 6)
        const actual = Vector3.add(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.addScalar` operates correctly", () => {
        const operand1 = new Vector3(1, 2, 3)
        const expected = new Vector3(2, 3, 4)
        const actual = Vector3.addScalar(operand1, 1)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.subtract` operates correctly", () => {
        const operand1 = new Vector3(1, 2, 3)
        const operand2 = new Vector3(1, 2, 3)
        const expected = new Vector3(0, 0, 0)
        const actual = Vector3.subtract(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.subtractScalar` operates correctly", () => {
        const operand1 = new Vector3(3, 5, 7)
        const expected = new Vector3(2, 4, 6)
        const actual = Vector3.subtractScalar(operand1, 1)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.multiply` operates correctly", () => {
        const operand1 = new Vector3(2, 4, 6)
        const operand2 = new Vector3(2, 4, 8)
        const expected = new Vector3(4, 16, 48)
        const actual = Vector3.multiply(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.multiplyScalar` operates correctly", () => {
        const operand1 = new Vector3(3, 5, 7)
        const expected = new Vector3(9, 15, 21)
        const actual = Vector3.multiplyScalar(operand1, 3)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.divide` operates correctly", () => {
        const operand1 = new Vector3(4, 6, 18)
        const operand2 = new Vector3(2, 3, 9)
        const expected = new Vector3(2, 2, 2)
        const actual = Vector3.divide(operand1, operand2)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.divideScalar` operates correctly", () => {
        const operand1 = new Vector3(6, 15, 24)
        const expected = new Vector3(2, 5, 8)
        const actual = Vector3.divideScalar(operand1, 3)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.reverse` operates correctly", () => {
        const operand = new Vector3(4, 6, -8)
        const expected = new Vector3(-4, -6, 8)
        const actual = Vector3.reverse(operand)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.invert` operates correctly", () => {
        const vector = new Vector3(0.5, 0.5, 0.25)
        const expected = new Vector3(2, 2, 4)
        const actual = Vector3.invert(vector)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.dot` operates correctly", () => {
        const operand1 = new Vector3(1, 2)
        const operand2 = new Vector3(3, 4)

        deepStrictEqual(Vector3.dot(operand1, operand2), 11)
    })

    test("`Vector3.cross` operates correctly", () => {
        const operand1 = new Vector3(1, 2)
        const operand2 = new Vector3(3, 4)
        const expected = new Vector3(0, 0, -2)

        deepStrictEqual(Vector3.cross(operand1, operand2), expected)
    })

    test("`Vector3.lerp` operates correctly", () => {
        const operand1 = new Vector3(10, 10, 10)
        const operand2 = new Vector3(20, 20, 20)
        const expected = new Vector3(15, 15, 15)
        const actual = Vector3.lerp(operand1, operand2, 0.5)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.reflect` operates correctly (case 1)", () => {
        const incident = new Vector3(0, -1, 0)
        const normal = new Vector3(0, 1, 0)
        const expected = new Vector3(0, 1, 0)
        const actual = Vector3.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.reflect` operates correctly (case 2)", () => {
        const incident = new Vector3(10, 0, 0)
        const normal = new Vector3(0, 1, 0)
        const expected = new Vector3(10, 0, 0)
        const actual = Vector3.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.reflect` operates correctly (case 3)", () => {
        const incident = new Vector3(0, 10, 0)
        const normal = new Vector3(0, 1, 0)
        const expected = new Vector3(0, -10, 0)
        const actual = Vector3.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.reflect` operates correctly (case 4)", () => {
        const incident = new Vector3(0, 10, 0)
        const normal = new Vector3(0, 0, 1)
        const expected = new Vector3(0, 10, 0)
        const actual = Vector3.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.reflect` operates correctly (case 5)", () => {
        const incident = new Vector3(10, 0, 0)
        const normal = new Vector3(0, 0, -1)
        const expected = new Vector3(10, 0, 0)
        const actual = Vector3.reflect(incident, normal)

        deepStrictEqual(actual, expected)
    })

    test("`Vector3.equal` checks equality correctly", () => {
        const vector1 = new Vector3(2, 5, 8)
        const vector2 = new Vector3(2, 5, 8)

        strictEqual(Vector3.equal(vector1, vector2), true)
    })
})