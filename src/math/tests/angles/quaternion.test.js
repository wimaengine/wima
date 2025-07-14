import { test, describe } from "node:test";
import { Quaternion } from "../../quaternion.js";
import { deepStrictEqual, strictEqual } from "node:assert";
import { PI } from "../../constants.js";

describe("Testing `Quaternion`", () => {
    test('`Quaternion` constructor works correctly', () => {
        const quaternion = new Quaternion(1, 2, 3, 4)

        strictEqual(quaternion.x, 1)
        strictEqual(quaternion.y, 2)
        strictEqual(quaternion.z, 3)
        strictEqual(quaternion.w, 4)
    })

    test('`Quaternion` default constructor is identity', () => {
        const quaternion = new Quaternion()
        const expected = new Quaternion(0, 0, 0, 1)

        deepStrictEqual(quaternion, expected)
    })

    test('`Quaternion.set` sets correctly', () => {
        const quaternion = Quaternion.set(1, 2, 3, 4)
        const expected = new Quaternion(1, 2, 3, 4)

        deepStrictEqual(quaternion, expected)
    })

    test('`Quaternion.copy` copies correctly', () => {
        const quaternion = new Quaternion(1, 2, 3, 4)
        const actual = Quaternion.copy(quaternion)
        const expected = new Quaternion(1, 2, 3, 4)

        deepStrictEqual(actual, expected)
    })

    test('`Quaternion.identity` is identity', () => {
        const quaternion = Quaternion.identity()
        const expected = new Quaternion(0, 0, 0, 1)

        deepStrictEqual(quaternion, expected)
    })

    test('`Quaternion.zero` is zero', () => {
        const quaternion = Quaternion.zero()
        const expected = new Quaternion(0, 0, 0, 0)

        deepStrictEqual(quaternion, expected)
    })

    test("`Quaternion.magnitudeSquared` operates correctly", () => {
        const operand = new Quaternion(3, 4, 0, 0)

        deepStrictEqual(Quaternion.magnitudeSquared(operand), 25)
    })

    test("`Quaternion.magnitude` operates correctly", () => {
        const operand = new Quaternion(3, 4, 0, 0)

        deepStrictEqual(Quaternion.magnitude(operand), 5)
    })

    test("`Quaternion.normalize` returns a unit vector", () => {
        const quaternion = new Quaternion(0, 0, 0, 1)
        const normalized = Quaternion.normalize(quaternion)

        strictEqual(Quaternion.magnitude(normalized), 1)
    })

    test("`Quaternion.normalize` preserves direction", () => {
        const quaternion = new Quaternion(0, 10, 0, 0)
        const expected = new Quaternion(0, 1, 0, 0)
        const actual = Quaternion.normalize(quaternion)

        deepStrictEqual(actual, expected)
    })

    test("`Quaternion.dot` operates correctly", () => {
        const operand1 = new Quaternion(1, 2, 9, 8)
        const operand2 = new Quaternion(3, 4, 7, 6)

        deepStrictEqual(Quaternion.dot(operand1, operand2), 122)
    })

    test('`Quaternion.reverse` operates correctly', () => {
        const quaternion = new Quaternion(1, -2, 3, 4)
        const actual = Quaternion.reverse(quaternion)
        const expected = new Quaternion(-1, 2, -3, 4)

        deepStrictEqual(actual, expected)
    })

    test("`Quaternion.multiply` operates correctly", () => {
        const quat1 = new Quaternion(0, 1, 0, 0)
        const quat2 = new Quaternion(0, -1, 0, 0)
        const expected = new Quaternion(0, 0, 0, 1)
        const actual = Quaternion.multiply(quat1, quat2)

        deepStrictEqual(actual, expected)
    })

    test("`Quaternion.rotateX` operates correctly", () => {
        const expected = new Quaternion(1, 0, 0, 0)
        const actual = Quaternion.rotateX(PI)

        strictEqual(Quaternion.fuzzyEqual(actual, expected), true)
    })

    test("`Quaternion.rotateY` operates correctly", () => {
        const expected = new Quaternion(0, 1, 0, 0)
        const actual = Quaternion.rotateY(PI)

        strictEqual(Quaternion.fuzzyEqual(actual, expected), true)
    })

    test("`Quaternion.rotateZ` operates correctly", () => {
        const expected = new Quaternion(0, 0, 1, 0)
        const actual = Quaternion.rotateZ(PI)

        strictEqual(Quaternion.fuzzyEqual(actual, expected), true)
    })

    test("`Quaternion.equal` checks equality correctly", () => {
        const vector1 = new Quaternion(2, 5, 8, 3)
        const vector2 = new Quaternion(2, 5, 8, 3)

        strictEqual(Quaternion.equal(vector1, vector2), true)
    })

    test("`Quaternion.Identity` is identity", () => {
        const expected = new Quaternion(0, 0, 0, 1)
        deepStrictEqual(Quaternion.Identity, expected)
    })

    test("`Quaternion.Zero` is zero", () => {
        const expected = new Quaternion(0, 0, 0, 0)
        deepStrictEqual(Quaternion.Zero, expected)
    })
})