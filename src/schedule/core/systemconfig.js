/** @import { SystemFunc } from "../../ecs/index.js" */
/** @import { Constructor } from "../../type/index.js" */

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

export default {}
