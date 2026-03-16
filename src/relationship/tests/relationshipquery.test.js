/**@import { ComponentHook } from '../../ecs/index.js' */

import { test, describe } from "node:test";
import { RelationshipQuery, VisitEntities } from "../core/index.js";
import { deepStrictEqual } from "node:assert";
import { World } from "../../ecs/registry.js";
import { ComponentHooks, Entity } from "../../ecs/index.js";

/**
 * @implements {VisitEntities}
 */
class Children {
  /**
   * @type {Entity[]}
   */
  list
  /**
   * @param {Entity[]} list 
   */
  constructor(list = []) {
    this.list = list
  }
  visit() {
    return this.list
  }
}

/**
 * @implements {VisitEntities}
 */
class Parent {
  /**
   * @param {Entity} entity
   */
  constructor(entity) {
    this.entity = entity
  }

  visit() {
    return [this.entity]
  }
}

/**
 * @implements {VisitEntities}
 */
class Neighbour {
  /**
   * @type {Entity[]}
   */
  list
  /**
   * @param {Entity[]} list 
   */
  constructor(list = []) {
    this.list = list
  }
  visit() {
    return this.list
  }
}

function createWorld() {
  const world = new World()
  world.registerType(Parent)
  world.setComponentHooks(Parent, new ComponentHooks(
    addSelfToParent
  ))
  world.setComponentHooks(Neighbour, new ComponentHooks(
    addSelfToNeighbour
  ))

  /**
   * @type {ComponentHook}
   */
  function addSelfToParent(entity, world) {
    const parent = world.get(entity, Parent)

    if (!parent) return

    const children = world.get(parent.entity, Children)

    if (children) {
      children.list.push(entity)
    } else {
      world.insert(parent.entity, [new Children([entity])])
    }
  }

  /**
   * @type {ComponentHook}
   */
  function addSelfToNeighbour(entity, world) {
    const neighbour = world.get(entity, Neighbour)

    if (!neighbour) return
    const neighbours = neighbour.visit()

    for (let i = 0; i < neighbours.length; i++) {
      const neighbourentity = neighbours[i];
      const lister = world.get(neighbourentity, Neighbour)

      if (!lister) {
        world.insert(neighbourentity, [new Neighbour([entity])])
      } else {
        const {list} = lister
        if(list.includes(entity)) return
        lister.list.push(entity)
      }
    }
  }
  return world
}

describe("Testing `RelationshipQuery`", () => {
  const world = createWorld()
  /**
   *        p1
   *     /  |  \
   *    /   |   \
   *   c1   c2   \
   *        |     \
   *       gc1    c3
   *            /  |  \
   *         gc2  gc3  gc4
   */
  const parent1 = world.spawn([])
  const child1 = world.spawn([new Parent(parent1)])
  const child2 = world.spawn([new Parent(parent1)])
  const child3 = world.spawn([new Parent(parent1)])
  const grandchild1 = world.spawn([new Parent(child2)])
  const grandchild2 = world.spawn([new Parent(child3)])
  const grandchild3 = world.spawn([new Parent(child3)])
  const grandchild4 = world.spawn([new Parent(child3)])

  /*
   * Ordered in a grid pattern
   *  1 -- 2 -- 3
   *  |    |    |
   *  4 -- 5 -- 6
   */
  const neighbour1 = world.spawn([])
  const neighbour2 = world.spawn([new Neighbour([neighbour1])])
  const neighbour3 = world.spawn([new Neighbour([neighbour2])])
  const neighbour4 = world.spawn([new Neighbour([neighbour1])])
  const neighbour5 = world.spawn([new Neighbour([neighbour2, neighbour4])])
  const neighbour6 = world.spawn([new Neighbour([neighbour5,neighbour3])])

  test("`RelationshipQuery` correctly does tree bfs iteration.", () => {
    const query = new RelationshipQuery(world, Children, Parent, [Entity])
    /**@type {[Entity,Entity][]} */
    const entities = []

    query.treebfs(parent1, ([child], [parent]) => {
      entities.push([parent, child])
    })

    deepStrictEqual(entities, [
      // order matters here as this is bfs
      [parent1, child1],
      [parent1, child2],
      [parent1, child3],
      [child2, grandchild1],
      [child3, grandchild2],
      [child3, grandchild3],
      [child3, grandchild4],
    ])
  })

  test("`RelationshipQuery` correctly does tree dfs iteration.", () => {
    const query = new RelationshipQuery(world, Children, Parent)
    /**@type {[Entity,Entity][]} */
    const entities = []

    query.treedfs(parent1, ([child], [parent]) => {
      entities.push([parent, child])
    })

    deepStrictEqual(entities, [
      // order matters here as this is dfs
      [parent1, child1],
      [parent1, child2],
      [child2, grandchild1],
      [parent1, child3],
      [child3, grandchild2],
      [child3, grandchild3],
      [child3, grandchild4],
    ])
  })

  test("`RelationshipQuery` correctly does graph bfs iteration.", () => {
    const query = new RelationshipQuery(world, Neighbour)
    /**@type {[Entity,Entity][]} */
    const entities = []

    query.graphbfs(neighbour1, ([child], [parent]) => {
      entities.push([parent, child])
    })

    deepStrictEqual(entities, [
      // order matters here as this is bfs
      [neighbour1, neighbour2],
      [neighbour1, neighbour4],
      [neighbour2, neighbour3],
      [neighbour2, neighbour5],
      [neighbour4, neighbour5],
      [neighbour3, neighbour6],
      [neighbour5, neighbour6],
    ])
  })

  test("`RelationshipQuery` correctly does graph dfs iteration.", () => {
    const query = new RelationshipQuery(world, Neighbour)
    /**@type {[Entity,Entity][]} */
    const entities = []

    query.graphdfs(neighbour1, ([child], [parent]) => {
      entities.push([parent, child])
    })

    deepStrictEqual(entities, [
      // order matters here as this is bfs
      [neighbour1, neighbour2],
      [neighbour2, neighbour3],
      [neighbour3, neighbour6],
      [neighbour6, neighbour5],
      [neighbour5, neighbour4],
      [neighbour1, neighbour4]
    ])
  })
})