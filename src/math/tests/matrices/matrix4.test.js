import { test, describe, todo } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { Matrix4 } from "../../matrix4.js";

describe("Testing `Matrix4`", () => {
    test('`Matrix4` default constructor is identity', () => {
        const actual = new Matrix4()
        const expected = new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
        deepStrictEqual(actual, expected)
    })

    test("`Matrix4.copy` actually copies", () => {
        const source = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const destination = Matrix4.copy(source)

        deepStrictEqual(destination, source)
    })

    test("`Matrix4.set` sets values corrrectly", () => {
        const expected = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const actual = Matrix4.set(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        deepStrictEqual(actual, expected)
    })

    test('`Matrix4.identity` is identity', () => {
        const actual = Matrix4.identity()
        const expected = new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
        deepStrictEqual(actual, expected)
    })

    test('`Matrix4.zero` is zero', () => {
        const actual = Matrix4.zero()
        const expected = new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
        deepStrictEqual(actual, expected)
    })

    test("`Matrix4.transpose` actually transposes", () => {
        const source = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const expected = new Matrix4(
            1, 5, 9, 13,
            2, 6, 10, 14,
            3, 7, 11, 15,
            4, 8, 12, 16
        )
        const destination = Matrix4.transpose(source)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix4.determinant` gives determinant", () => {
        const matrix = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        strictEqual(matrix.determinant(), 0)
    })

    test("`Matrix4.trace` gives trace", () => {
        const matrix = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        strictEqual(matrix.trace(), 34)
    })

    test("`Matrix4.add` adds correctly", () => {
        const operand1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const operand2 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        const expected = new Matrix4(
            2, 4, 6, 8,
            10, 12, 14, 16,
            18, 20, 22, 24,
            26, 28, 30, 32
        )
        const result = Matrix4.add(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.addScalar` adds correctly", () => {
        const operand1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        const expected = new Matrix4(
            2, 3, 4, 5,
            6, 7, 8, 9,
            10, 11, 12, 13,
            14, 15, 16, 17
        )
        const result = Matrix4.addScalar(operand1, 1)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.subtract` subtracts correctly", () => {
        const operand1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const operand2 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        const expected = new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
        const result = Matrix4.subtract(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.subtractScalar` subtracts correctly", () => {
        const operand1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        const expected = new Matrix4(
            0, 1, 2, 3,
            4, 5, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15,
        )
        const result = Matrix4.subtractScalar(operand1, 1)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.multiply` multiplies correctly", () => {
        const operand1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const operand2 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        const expected = new Matrix4(
            90, 100, 110, 120,
            202, 228, 254, 280,
            314, 356, 398, 440,
            426, 484, 542, 600
        )
        const result = Matrix4.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.multiplyScalar` multiplies correctly", () => {
        const operand1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        const expected = new Matrix4(
            2, 4, 6, 8,
            10, 12, 14, 16,
            18, 20, 22, 24,
            26, 28, 30, 32
        )
        const result = Matrix4.multiplyScalar(operand1, 2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.divide` divides correctly", () => {
        const operand1 = new Matrix4(
            1, 0, 0, 1,
            0, 2, 1, 2,
            2, 1, 0, 1,
            2, 0, 1, 4
        )
        const operand2 = new Matrix4(
            1, 0, 0, 1,
            0, 2, 1, 2,
            2, 1, 0, 1,
            2, 0, 1, 4
        )

        const expected = new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
        const result = Matrix4.divide(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.divideScalar` divides correctly", () => {
        const operand1 = new Matrix4(
            2, 4, 6, 8,
            10, 12, 14, 16,
            18, 20, 22, 24,
            26, 28, 30, 32
        )

        const expected = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const result = Matrix4.divideScalar(operand1, 2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix4.invert` actually invert", () => {
        const matrix = new Matrix4(
            1, 0, 0, 1,
            0, 2, 1, 2,
            2, 1, 0, 1,
            2, 0, 1, 4
        )
        const expected = new Matrix4(
            -2, -0.5, 1, 0.5,
            1, 0.5, 0, -0.5,
            -8, -1, 2, 2,
            3, 0.5, -1, -0.5
        )
        const destination = Matrix4.invert(matrix)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix4.invert` with no solution returns zero", () => {
        const matrix = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const expected = new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
        const destination = Matrix4.invert(matrix)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix4.equal` tests equality", () => {
        const matrix1 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )
        const matrix2 = new Matrix4(
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        )

        strictEqual(Matrix4.equal(matrix1, matrix2), true)
    })

    test("`Matrix4.Identity` is identity", () => {
        const expected = new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
        deepStrictEqual(Matrix4.Identity, expected)
    })

    test("`Matrix4.Zero` is zero", () => {
        const expected = new Matrix4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
        deepStrictEqual(Matrix4.Zero, expected)
    })
})