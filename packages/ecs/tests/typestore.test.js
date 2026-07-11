import { test, describe } from "vitest";
import { deepStrictEqual } from "node:assert";
import { typeid } from "@wimaengine/type";
import { TypeStore } from "../src";
import { EntityHandle } from "../src/entities";

describe("Testing `TypeStore`", () => {
  test('`getOrSet` reuses the first registered id.', () => {
    const store = new TypeStore()

    const first = store.getOrSet(EntityHandle)
    const second = store.getOrSet(EntityHandle)

    deepStrictEqual(first, 0)
    deepStrictEqual(second, 0)
    deepStrictEqual(
      [...store.getInfos()].map((info) => info.name),
      [typeid(EntityHandle)]
    )
  })

  test('`getOrSetByTypeId` reuses the first registered id.', () => {
    const store = new TypeStore()
    const id = typeid(EntityHandle)

    const first = store.getOrSetByTypeId(id)
    const second = store.getOrSetByTypeId(id)

    deepStrictEqual(first, 0)
    deepStrictEqual(second, 0)
    deepStrictEqual(
      [...store.getInfos()].map((info) => info.name),
      [typeid(EntityHandle)]
    )
  })
})
