import { formatString } from "./common.js"

export const AbstractClassError = {
    Unconstructable: "The class `{0}` is not constructible.Extend the class.",
    MethodUnimplemented: "The method `{0}.{1}()` is not implemented. Override the method without using `super.{1}()`.",
    MethodUncallable: "The method `{0}.{1}()` is not callable.`{0}` is an abstract class."
}

/**
 * @template {import("../type/index.js").Constructor} U
 * @template {InstanceType<U>} T
 * @param {T} item
 * @param {U} baseConstructor
 * @param {(...args: any[]) => any} method
 * @returns {never}
 */
export function abstractMethod(item, baseConstructor, method) {
    if (item.constructor === baseConstructor) {
        throw formatString(AbstractClassError.MethodUncallable, item.constructor.name, method.name)
    }
    throw formatString(AbstractClassError.MethodUnimplemented, item.constructor.name, method.name)
}

/**
 * 
 * @param {object} item 
 * @param {object} baseConstructor 
 * @returns {never | void}
 */
export function abstractClass(item, baseConstructor) {
    if (item.constructor === baseConstructor) {
        throw formatString(AbstractClassError.Unconstructable, item.constructor.name)
    }
}
