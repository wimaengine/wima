import { test, describe } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { Assets,Handle } from "../core/index.js";
import { AssetAdded, AssetModified } from "../events/assets.js";

describe("Testing `Assets`", () => {
    test('`Assets.add` adds the asset correctly', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        const expected = assets.get(handle)

        deepStrictEqual(asset, expected)
    })

    test('`Assets.set` modifies the asset correctly at its handle', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"
        const replacement = "Wima engine is the best"

        const handle = assets.add(asset)
        assets.set(handle,replacement)
        const actual = assets.get(handle)
        

        deepStrictEqual(actual,replacement)
    })

    test('`Assets.setWithUUID` adds the asset correctly', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"
        const uuid = "124-ufy7f-yrffu-67ftcgh"

        const handle = assets.setWithUUID(uuid,asset)
        const expected = assets.get(handle)

        deepStrictEqual(asset, expected)
    })

    test('`Assets.setWithUUID` modifies the asset correctly at its handle', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"
        const uuid = "124-ufy7f-yrffu-67ftcgh"
        const replacement = "Wima engine is the best"

        const handle = assets.setWithUUID(uuid,asset)
        assets.setWithUUID(uuid,replacement)
        const actual = assets.get(handle)
        
        deepStrictEqual(actual,replacement)
    })

    test('`Assets.get` returns undefined on invalid handle', () => {
        const assets = new Assets(String)

        const handle = new Handle(assets,0)
        const actual = assets.get(handle)

        strictEqual(actual, undefined)
    })

    test('`Assets.get` gets the correct asset (case 1)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        const expected = assets.get(handle)

        deepStrictEqual(asset, expected)
    })

    test('`Assets.get` gets the correct asset (case 2)', () => {
        const assets = new Assets(String)

        const asset1 = "Wima engine 1"
        const asset2 = "Wima engine 2"
        const asset3 = "Wima engine 3"

        const handle1 = assets.add(asset1)
        const handle2 = assets.add(asset2)
        const handle3 = assets.add(asset3)

        const expected1 = assets.get(handle1)
        const expected2 = assets.get(handle2)
        const expected3 = assets.get(handle3)

        deepStrictEqual(asset1, expected1)
        deepStrictEqual(asset2, expected2)
        deepStrictEqual(asset3, expected3)
    })

    test('`Assets.getByUUID` returns undefined on invalid handle', () => {
        const assets = new Assets(String)

        const uuid = "124-ufy7f-yrffu-67ftcgh"
        const actual = assets.getByUUID(uuid)

        strictEqual(actual, undefined)
    })

    test('`Assets.getByUUID` gets the correct asset (case 1)', () => {
        const assets = new Assets(String)
        const uuid = "124-ufy7f-yrffu-67ftcgh"
        const asset = "wima engine"

        assets.setWithUUID(uuid, asset)

        const actual = assets.getByUUID(uuid)

        deepStrictEqual(actual, asset)
    })

    test('`Assets.getByUUID` gets the correct asset (case 2)', () => {
        const assets = new Assets(String)
        const uuid1 = "124-ufy7f-yrffu-67ftcgh"
        const uuid2 = "12a2-ufy7f-yrffu-yytr56lm"
        const uuid3 = "46gvn-jnkjn-yrffu-67ftcgh"

        const asset1 = "wima engine 1"
        const asset2 = "wima engine 2"
        const asset3 = "wima engine 3"

        assets.setWithUUID(uuid1, asset1)
        assets.setWithUUID(uuid2, asset2)
        assets.setWithUUID(uuid3, asset3)

        const actual1 = assets.getByUUID(uuid1)
        const actual2 = assets.getByUUID(uuid2)
        const actual3 = assets.getByUUID(uuid3)

        deepStrictEqual(actual1, asset1)
        deepStrictEqual(actual2, asset2)
        deepStrictEqual(actual3, asset3)
    })

    test('`Assets.getHandleByUUID` returns undefined on invalid uuid', () => {
        const assets = new Assets(String)

        const uuid = "124-ufy7f-yrffu-67ftcgh"
        const actual = assets.getHandleByUUID(uuid)

        deepStrictEqual(actual, undefined)
    })

    test('`Assets.getHandleByUUID` gets the correct handle (case 1)', () => {
        const assets = new Assets(String)

        const uuid = "124-ufy7f-yrffu-67ftcgh"
        const asset = "wima engine 1"

        const handle = assets.setWithUUID(uuid, asset)

        const actual = assets.getHandleByUUID(uuid)

        deepStrictEqual(actual, handle)
    })

    test('`Assets.getHandleByUUID` gets the correct handle (case 2)', () => {
        const assets = new Assets(String)
        const uuid1 = "124-ufy7f-yrffu-67ftcgh"
        const uuid2 = "124-ufy7f-yrffu-67ftcgh"
        const uuid3 = "124-ufy7f-yrffu-67ftcgh"

        const asset1 = "wima engine 1"
        const asset2 = "wima engine 2"
        const asset3 = "wima engine 3"

        const handle1 = assets.setWithUUID(uuid1, asset1)
        const handle2 = assets.setWithUUID(uuid2, asset2)
        const handle3 = assets.setWithUUID(uuid3, asset3)

        const actual1 = assets.getHandleByUUID(uuid1)
        const actual2 = assets.getHandleByUUID(uuid2)
        const actual3 = assets.getHandleByUUID(uuid3)

        deepStrictEqual(actual1, handle1)
        deepStrictEqual(actual2, handle2)
        deepStrictEqual(actual3, handle3)
    })

    test('`Assets.getByAssetId` returns undefined on invalid assetid', () => {
        const assets = new Assets(String)

        const handle = new Handle(assets,0).id()
        const actual = assets.getByAssetId(handle)

        strictEqual(actual, undefined)
    })

    test('`Assets.getByAssetId` gets the correct asset (case 1)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        const expected = assets.getByAssetId(handle.id())

        deepStrictEqual(asset, expected)
    })

    test('`Assets.getByAssetId` gets the correct asset (case 2)', () => {
        const assets = new Assets(String)

        const asset1 = "Wima engine 1"
        const asset2 = "Wima engine 2"
        const asset3 = "Wima engine 3"

        const handle1 = assets.add(asset1)
        const handle2 = assets.add(asset2)
        const handle3 = assets.add(asset3)

        const expected1 = assets.getByAssetId(handle1.id())
        const expected2 = assets.getByAssetId(handle2.id())
        const expected3 = assets.getByAssetId(handle3.id())

        deepStrictEqual(asset1, expected1)
        deepStrictEqual(asset2, expected2)
        deepStrictEqual(asset3, expected3)
    })

    test('`Assets.getByAssetId` sets the correct asset (case 1)', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        const expected = assets.getByAssetId(handle.id())

        deepStrictEqual(asset, expected)
    })

    test('Assets provides the right event when asset is added', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        const events = assets.flushEvents()

        deepStrictEqual(events[0], new AssetAdded(String, handle.id()))
    })

    test('Assets provides the right event when asset is modified', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"

        const handle = assets.add(asset)
        assets.set(handle, asset)
        const events = assets.flushEvents()

        deepStrictEqual(events[1], new AssetModified(String, handle.id()))
    })

    test('Assets provides the right events when asset is added/modified using uuid', () => {
        const assets = new Assets(String)
        const asset = "Wima engine"
        const uuid1 = "124-ufy7f-yrffu-67ftcgh"
        const uuid2 = "1243f-ufy7f-eggfu-6cghjeha46"

        const handle1 = assets.setWithUUID(uuid1,asset)
        const handle2 = assets.setWithUUID(uuid2,asset)
        assets.setWithUUID(uuid1,asset)
        assets.setWithUUID(uuid2,asset)
        const events = assets.flushEvents()

        deepStrictEqual(events[0], new AssetAdded(String, handle1.id()))
        deepStrictEqual(events[1], new AssetAdded(String, handle2.id()))
        deepStrictEqual(events[2], new AssetModified(String, handle1.id()))
        deepStrictEqual(events[3], new AssetModified(String, handle2.id()))
    })
})