import { test, describe } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { Matrix3 } from "../../core/index.js";

describe("Testing `Matrix3`", () => {
    test('`Matrix3` default constructor is identity', () => {
        const actual = new Matrix3()
        const expected = new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
        deepStrictEqual(actual, expected)
    })

    test("`Matrix3.copy` actually copies", () => {
        const source = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const destination = Matrix3.copy(source)

        deepStrictEqual(destination, source)
    })

    test("`Matrix3.set` sets values corrrectly", () => {
        const expected = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const actual = Matrix3.set(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        deepStrictEqual(actual, expected)
    })

    test('`Matrix3.identity` is identity', () => {
        const actual = Matrix3.identity()
        const expected = new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
        deepStrictEqual(actual, expected)
    })

    test('`Matrix3.zero` is zero', () => {
        const actual = Matrix3.zero()
        const expected = new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
        deepStrictEqual(actual, expected)
    })

    test("`Matrix3.transpose` actually transposes", () => {
        const source = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const expected = new Matrix3(
            1, 4, 7,
            2, 5, 8,
            3, 6, 9
        )
        const destination = Matrix3.transpose(source)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix3.determinant` gives determinant", () => {
        const matrix = new Matrix3(
            1, 3, 0,
            4, 1, 0,
            2, 0, 1
        )

        strictEqual(matrix.determinant(), -11)
    })

    test("`Matrix3.trace` gives trace", () => {
        const matrix = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        strictEqual(matrix.trace(), 15)
    })

    test("`Matrix3.add` adds correctly", () => {
        const operand1 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const operand2 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        const expected = new Matrix3(
            2, 4, 6,
            8, 10, 12,
            14, 16, 18
        )
        const result = Matrix3.add(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.addScalar` adds correctly", () => {
        const operand1 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        const expected = new Matrix3(
            2, 3, 4,
            5, 6, 7,
            8, 9, 10
        )
        const result = Matrix3.addScalar(operand1, 1)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.subtract` subtracts correctly", () => {
        const operand1 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const operand2 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        const expected = new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
        const result = Matrix3.subtract(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.subtractScalar` subtracts correctly", () => {
        const operand1 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        const expected = new Matrix3(
            0, 1, 2,
            3, 4, 5,
            6, 7, 8
        )
        const result = Matrix3.subtractScalar(operand1, 1)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.multiply` multiplies correctly", () => {
        const operand1 = new Matrix3(
            1, 8, 3,
            9, 4, 5,
            6, 2, 7
        )
        const operand2 = new Matrix3(
            6, 7, 4,
            1, 3, 2,
            5, 9, 8
        )

        const expected = new Matrix3(
            29, 58, 44,
            83, 120, 84,
            73, 111, 84
        )
        const result = Matrix3.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.multiplyScalar` multiplies correctly", () => {
        const operand1 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        const expected = new Matrix3(
            2, 4, 6,
            8, 10, 12,
            14, 16, 18
        )
        const result = Matrix3.multiplyScalar(operand1, 2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.divide` divides correctly", () => {
        const operand1 = new Matrix3(
            1, 2, 3,
            0, 1, 4,
            5, 6, 0
        )
        const operand2 = new Matrix3(
            1, 2, 3,
            0, 1, 4,
            5, 6, 0
        )

        const expected = new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
        const result = Matrix3.divide(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.divideScalar` divides correctly", () => {
        const operand1 = new Matrix3(
            2, 4, 6,
            8, 10, 12,
            14, 16, 18
        )

        const expected = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const result = Matrix3.divideScalar(operand1, 2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix3.invert` actually invert", () => {
        const matrix = new Matrix3(
            1, 2, 3,
            0, 1, 4,
            5, 6, 0
        )
        const expected = new Matrix3(
            -24, 18, 5,
            20, -15, -4,
            -5, 4, 1
        )
        const destination = Matrix3.invert(matrix)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix3.invert` with no solution returns zero", () => {
        const matrix = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const expected = new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
        const destination = Matrix3.invert(matrix)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix3.equal` tests equality", () => {
        const matrix1 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )
        const matrix2 = new Matrix3(
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        )

        strictEqual(Matrix3.equal(matrix1, matrix2), true)
    })

    test("`Matrix3.Identity` is identity", () => {
        const expected = new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        )
        deepStrictEqual(Matrix3.Identity, expected)
    })

    test("`Matrix3.Zero` is zero", () => {
        const expected = new Matrix3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
        deepStrictEqual(Matrix3.Zero, expected)
    })
})