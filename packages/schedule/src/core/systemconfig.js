/** @import { SystemFunc } from "@wimaengine/ecs" */
/** @import { Constructor } from "@wimaengine/type" */
/** @import { CrossWorldSystemFunc } from "./crossworldsystem" */

/**
 * @typedef {SystemFunc | Constructor | string} SystemOrderReference
 */

/**
 * @typedef SystemConfig
 * @property {SystemFunc} system
 * @property {Constructor} schedule
 * @property {string | undefined} [label]
 * @property {Constructor | undefined} [systemGroup]
 * @property {SystemOrderReference[] | undefined} [before]
 * @property {SystemOrderReference[] | undefined} [after]
 */

/**
 * @typedef SystemGroupConfig
 * @property {Constructor} label
 * @property {Constructor} schedule
 * @property {Constructor | undefined} [parent]
 * @property {SystemOrderReference[] | undefined} [before]
 * @property {SystemOrderReference[] | undefined} [after]
 */

/**
 * @typedef {CrossWorldSystemFunc | Constructor | string} CrossWorldSystemOrderReference
 */

/**
 * @typedef CrossWorldSystemConfig
 * @property {CrossWorldSystemFunc} system
 * @property {Constructor} schedule
 * @property {string | undefined} [label]
 * @property {CrossWorldSystemOrderReference[] | undefined} [before]
 * @property {CrossWorldSystemOrderReference[] | undefined} [after]
 */

/**
 * @typedef CrossWorldScheduleConfig
 * @property {Constructor} label
 * @property {Constructor | undefined} [world]
 * @property {Constructor} sourceWorld
 * @property {number | undefined} [delay]
 * @property {boolean | undefined} [repeat]
 * @property {(error: Error, world: import("@wimaengine/ecs").World) => void | undefined} [errorHandler]
 */

export {}
