import { test, describe } from "node:test";
import { Rotary } from "../../rotary.js";
import { deepStrictEqual, strictEqual } from "node:assert";
import { HALF_PI, PI } from "../../constants.js";

describe("Testing `Rotary`", () => {
    test("`Rotary` constructor works correctly", () => {
        const rotary = new Rotary(1, 2)

        strictEqual(rotary.cos, 1)
        strictEqual(rotary.sin, 2)
    })

    test("`Rotary` default constructor is identity", () => {
        const rotary = new Rotary()
        const expected = new Rotary(1, 0)

        deepStrictEqual(rotary, expected)
    })

    test("`Rotary.copy` copies correctly", () => {
        const rotary = new Rotary(1, 5)
        const expected = Rotary.copy(rotary)

        deepStrictEqual(rotary, expected)
    })

    test("`Rotary.set` sets correctly", () => {
        const rotary = Rotary.set(1, 2)
        const expected = new Rotary(1, 2)

        deepStrictEqual(rotary, expected)
    })

    test("`Rotary.identity` is actually an identity", () => {
        const expected = new Rotary(1, 0)
        const actual = Rotary.identity()

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.zero` is actually an zero", () => {
        const expected = new Rotary(0, 0)
        const actual = Rotary.zero()


        deepStrictEqual(actual, expected)
    })

    test("`Rotary.normalize` returns a unit rotary", () => {
        const rotary = new Rotary(1, 0)
        const normalized = Rotary.normalize(rotary)

        strictEqual(Rotary.magnitude(normalized), 1)
    })

    test("`Rotary.normalize` preserves direction", () => {
        const rotary = new Rotary(10, 0)
        const expected = new Rotary(1, 0)
        const actual = Rotary.normalize(rotary)

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.magnitudeSquared` operates correctly", () => {
        const operand = new Rotary(3, 4)

        deepStrictEqual(Rotary.magnitudeSquared(operand), 25)
    })

    test("`Rotary.magnitude` operates correctly", () => {
        const operand = new Rotary(3, 4)

        deepStrictEqual(Rotary.magnitude(operand), 5)
    })

    test("`Rotary.multiply` operates correctly (case 1)", () => {
        const rotary1 = new Rotary(1, 0)
        const rotary2 = new Rotary(1, 0)
        const expected = new Rotary(1, 0)
        const actual = Rotary.multiply(rotary1, rotary2)

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.multiply` operates correctly (case 2)", () => {
        const rotary1 = new Rotary(1, 0)
        const rotary2 = new Rotary(0, 1)
        const expected = new Rotary(0, 1)
        const actual = Rotary.multiply(rotary1, rotary2)

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.multiply` operates correctly (case 3)", () => {
        const rotary1 = new Rotary(0, 1)
        const rotary2 = new Rotary(0, 1)
        const expected = new Rotary(-1, 0)
        const actual = Rotary.multiply(rotary1, rotary2)

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.multiply` operates correctly (case 4)", () => {
        const rotary1 = new Rotary(0, 1)
        const rotary2 = new Rotary(-1, 0)
        const expected = new Rotary(-0, -1)
        const actual = Rotary.multiply(rotary1, rotary2)

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.multiplyScalar` operates correctly", () => {
        const rotary1 = new Rotary(0, 1)
        const rotary2 = new Rotary(-1, 0)
        const expected = new Rotary(-0, -1)
        const actual = Rotary.multiply(rotary1, rotary2)

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.rotate` operates correctly (case 1)", () => {
        const expected = new Rotary(0, 1)
        const actual = Rotary.rotate(HALF_PI)

        strictEqual(Rotary.fuzzyEqual(expected,actual), true)
    })

    test("`Rotary.rotate` operates correctly (case 2)", () => {
        const expected = new Rotary(0, -1)
        const actual = Rotary.rotate(-HALF_PI)

        strictEqual(Rotary.fuzzyEqual(expected,actual), true)
    })

    test("`Rotary.rotate` operates correctly (case 3)", () => {
        const expected = new Rotary(-1, 0)
        const actual = Rotary.rotate(PI)

        strictEqual(Rotary.fuzzyEqual(expected,actual), true)
    })

    test("`Rotary.rotate` operates correctly (case 4)", () => {
        const expected = new Rotary(-1,0)
        const actual = Rotary.rotate(-PI)

        strictEqual(Rotary.fuzzyEqual(expected,actual), true)
    })

    test("`Rotary.reverse` operates correctly", () => {
        const operand = new Rotary(4, 6)
        const expected = new Rotary(-4, -6)
        const actual = Rotary.reverse(operand)

        deepStrictEqual(actual, expected)
    })

    test("`Rotary.dot` operates correctly", () => {
        const operand1 = new Rotary(1, 2)
        const operand2 = new Rotary(3, 4)

        deepStrictEqual(Rotary.dot(operand1, operand2), 11)
    })

    test("`Rotary.equal` checks equality correctly", () => {
        const vector1 = new Rotary(2, 5)
        const vector2 = new Rotary(2, 5)

        strictEqual(Rotary.equal(vector1, vector2), true)
    })

    test("`Rotary.Identity` is actually an identity", () => {
        const expected = new Rotary(1, 0)

        deepStrictEqual(Rotary.Identity, expected)
    })

    test("`Rotary.Zero` is actually an identity", () => {
        const expected = new Rotary(0, 0)

        deepStrictEqual(Rotary.Zero, expected)
    })
})