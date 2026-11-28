import { expect, it } from "vitest"
import { EntityHandle, World } from "@wimaengine/ecs"
import { Children, Parent } from "../src/components"
import { addSelfToParent } from "../src/hooks"

it("does not duplicate a child when the parent relationship is added twice", () => {
  const world = new World()
  const parent = world.spawn([])
  const child = world.spawn([new Parent(parent)])

  addSelfToParent(child, world)
  addSelfToParent(EntityHandle.from(child.id()), world)

  expect(world.get(parent, Children)?.list).toHaveLength(1)
  expect(world.get(parent, Children)?.list[0].equals(child)).toBe(true)
})
