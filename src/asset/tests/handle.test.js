import { deepStrictEqual, strictEqual } from "assert";
import test, { describe } from "node:test";
import { Assets } from "../core/index.js";

describe('Testing `Handle`',()=>{
    test('`Handle` clone is same as original', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle1 = assets.add(asset)
        const handle2 = handle1.clone()

        deepStrictEqual(handle1, handle2)
    })

    test('`Handle` clone gets same asset as original (case 1)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle1 = assets.add(asset)
        const handle2 = handle1.clone()
        const actual = assets.get(handle2)

        deepStrictEqual(actual, asset)
    })

    test('`Handle` clone gets same asset as original (case 2)', () => {
        const assets = new Assets(String)
        const asset1 = "Wima engine 1"
        const asset2 = "Wima engine 2"

        const handle1 = assets.add(asset1)
        const handle2 = assets.add(asset2)
        const handle3 = handle1.clone()
        const handle4 = handle2.clone()
        const actual1 = assets.get(handle3)
        const actual2 = assets.get(handle4)

        deepStrictEqual(actual1, asset1)
        deepStrictEqual(actual2, asset2)
    })

    test('`Handle` is reference counted correctly (case 1)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        const entry = assets.getEntry(handle)

        strictEqual(entry.refCount, 1)
    })

    test('`Handle` is reference counted correctly (case 2)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        handle.clone()
        handle.clone()
        const entry = assets.getEntry(handle)

        strictEqual(entry.refCount, 3)
    })

    test('`Handle` is reference counted correctly (case 3)', () => {
        const assets = new Assets(String)

        const asset1 = "Wima engine 1"
        const asset2 = "Wima engine 2"
        const asset3 = "Wima engine 3"

        const handle1 = assets.add(asset1)
        const handle2 = assets.add(asset2)
        const handle3 = assets.add(asset3)

        const entry1 = assets.getEntry(handle1)
        const entry2 = assets.getEntry(handle2)
        const entry3 = assets.getEntry(handle3)

        deepStrictEqual(entry1.refCount,1)
        deepStrictEqual(entry2.refCount,1)
        deepStrictEqual(entry3.refCount,1)
    })

    test('`Handle.drop` removes asset (case 1)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        handle.drop()
        const actual = assets.get(handle)

        deepStrictEqual(actual, undefined)
    })

    test('`Handle.drop` removes asset (case 2)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle1 = assets.add(asset)
        const handle2 = handle1.clone()
        const handle3 = handle1.clone()

        handle1.drop()
        handle2.drop()
        handle3.drop()

        const actual = assets.get(handle1)

        deepStrictEqual(actual, undefined)
    })

    test('`Handle.drop` does not remove asset prematurely', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle1 = assets.add(asset)
        const handle2 = handle1.clone()
        const handle3 = handle1.clone()

        handle2.drop()
        handle3.drop()
        
        const actual = assets.get(handle1)

        deepStrictEqual(actual, asset)
    })

    test('`Handle.drop` only drops once.', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle1 = assets.add(asset)
        const handle2 = handle1.clone()

        handle2.drop()
        handle2.drop()
        
        const actual = assets.get(handle1)

        deepStrictEqual(actual, asset)
    })

    test('`Handle` generation starts at one (case 1).', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)

        deepStrictEqual(handle.generation, 1)
    })

    test('`Handle` generation starts at one (case 2).', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle1 = assets.add(asset)
        const handle2 = assets.add(asset)

        deepStrictEqual(handle1.generation, 1)
        deepStrictEqual(handle2.generation, 1)
    })

    test('Recycled `Handle`s have incremented generation.', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle1 = assets.add(asset)
        handle1.drop()
        const handle2 = assets.add(asset)
        handle2.drop()
        const handle3 = assets.add(asset)

        deepStrictEqual(handle1.index, 0)
        deepStrictEqual(handle1.generation, 1)
        deepStrictEqual(handle2.index, 0)
        deepStrictEqual(handle2.generation, 2)
        deepStrictEqual(handle3.index, 0)
        deepStrictEqual(handle3.generation, 3)
    })
})