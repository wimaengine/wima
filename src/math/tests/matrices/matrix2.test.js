import { test, describe } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { Matrix2 } from "../../matrix2.js";

describe("Testing `Matrix2`", () => {
    test('`Matrix2` default constructor is identity', () => {
        const actual = new Matrix2()
        const expected = new Matrix2(
            1, 0,
            0, 1
        )
        deepStrictEqual(actual, expected)
    })

    test("`Matrix2.copy` actually copies", () => {
        const source = new Matrix2(
            1, 2,
            3, 4
        )
        const destination = Matrix2.copy(source)

        deepStrictEqual(destination, source)
    })

    test("`Matrix2.set` sets values corrrectly", () => {
        const expected = new Matrix2(
            1, 2,
            3, 4
        )
        const actual = Matrix2.set(
            1, 2,
            3, 4
        )

        deepStrictEqual(actual, expected)
    })

    test('`Matrix2.identity` is identity', () => {
        const actual = Matrix2.identity()
        const expected = new Matrix2(
            1, 0,
            0, 1
        )
        deepStrictEqual(actual, expected)
    })

    test('`Matrix2.zero` is zero', () => {
        const actual = Matrix2.zero()
        const expected = new Matrix2(
            0, 0,
            0, 0
        )
        deepStrictEqual(actual, expected)
    })

    test("`Matrix2.transpose` actually transposes", () => {
        const source = new Matrix2(
            1, 2,
            3, 4
        )
        const expected = new Matrix2(
            1, 3,
            2, 4
        )
        const destination = Matrix2.transpose(source)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix2.determinant` gives determinant", () => {
        const matrix = new Matrix2(
            3, 2,
            2, 3
        )

        strictEqual(matrix.determinant(), 5)
    })

    test("`Matrix2.trace` gives trace", () => {
        const matrix = new Matrix2(
            1, 2,
            3, 4
        )

        strictEqual(matrix.trace(), 5)
    })

    test("`Matrix2.add` adds correctly", () => {
        const operand1 = new Matrix2(
            1, 2,
            3, 4
        )
        const operand2 = new Matrix2(
            1, 2,
            3, 4
        )

        const expected = new Matrix2(
            2, 4,
            6, 8
        )
        const result = Matrix2.add(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.addScalar` adds correctly", () => {
        const operand1 = new Matrix2(
            1, 2,
            3, 4
        )

        const expected = new Matrix2(
            5, 6,
            7, 8
        )
        const result = Matrix2.addScalar(operand1, 4)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.subtract` subtracts correctly", () => {
        const operand1 = new Matrix2(
            1, 2,
            3, 4
        )
        const operand2 = new Matrix2(
            1, 2,
            3, 4
        )

        const expected = new Matrix2(
            0, 0,
            0, 0
        )
        const result = Matrix2.subtract(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.subtractScalar` subtracts correctly", () => {
        const operand1 = new Matrix2(
            1, 2,
            3, 4
        )

        const expected = new Matrix2(
            -3, -2,
            -1, 0
        )
        const result = Matrix2.subtractScalar(operand1, 4)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.multiply` multiplies correctly", () => {
        const operand1 = new Matrix2(
            2, 1,
            3, 4
        )
        const operand2 = new Matrix2(
            5, 6,
            7, 8
        )

        const expected = new Matrix2(
            17, 20,
            43, 50
        )
        const result = Matrix2.multiply(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.multiplyScalar` multiplies correctly", () => {
        const operand1 = new Matrix2(
            1, 2,
            3, 4
        )

        const expected = new Matrix2(
            4, 8,
            12, 16
        )
        const result = Matrix2.multiplyScalar(operand1, 4)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.divide` divides correctly", () => {
        const operand1 = new Matrix2(
            1, 2,
            3, 4
        )
        const operand2 = new Matrix2(
            1, 2,
            3, 4
        )

        const expected = new Matrix2(
            1, 0,
            0, 1
        )
        const result = Matrix2.divide(operand1, operand2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.divideScalar` divides correctly", () => {
        const operand1 = new Matrix2(
            2, 4,
            6, 8
        )

        const expected = new Matrix2(
            1, 2,
            3, 4
        )
        const result = Matrix2.divideScalar(operand1, 2)

        deepStrictEqual(result, expected)
    })

    test("`Matrix2.invert` actually invert", () => {
        const matrix = new Matrix2(
            4, 3,
            3, 2
        )
        const expected = new Matrix2(
            -2, 3,
            3, -4
        )
        const destination = Matrix2.invert(matrix)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix2.invert` with no solution returns zero", () => {
        const matrix = new Matrix2(
            2, 4,
            2, 4
        )
        const expected = new Matrix2(
            0, 0,
            0, 0
        )
        const destination = Matrix2.invert(matrix)

        deepStrictEqual(destination, expected)
    })

    test("`Matrix2.equal` tests equality", () => {
        const matrix1 = new Matrix2(
            1, 2,
            3, 4
        )
        const matrix2 = new Matrix2(
            1, 2,
            3, 4
        )

        strictEqual(Matrix2.equal(matrix1, matrix2), true)
    })

    test("`Matrix2.Identity` is identity", () => {
        const expected = new Matrix2(
            1, 0,
            0, 1
        )
        deepStrictEqual(Matrix2.Identity, expected)
    })

    test("`Matrix2.Zero` is zero", () => {
        const expected = new Matrix2(
            0, 0,
            0, 0
        )
        deepStrictEqual(Matrix2.Zero, expected)
    })
})