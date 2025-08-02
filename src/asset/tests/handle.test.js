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
})