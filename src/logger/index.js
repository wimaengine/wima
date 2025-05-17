const marker = '🚀Chaos Engine:\n\n'
const mess = ['']

/**
 * Logs out a message to the console.
 *
 * @param {string} message
 */
export function log(message) {
  console.log(marker + message)
}

/**
 * Logs out a warning to the console.
 *
 * @param {string} message
 */
export function warn(message) {
  console.warn(marker + message)
}

/**
 * Logs out a warning once to the console.
 *
 * @param {string} message
 */
export function warnOnce(message) {
  if (mess.includes(message)) return

  mess.push(message)
  warn(message)

}

/**
 * Logs out a non fatal error to the console.
 *
 * @param {string} message
 */
export function error(message) {
  console.error(marker + message)
}

/**
 * Throws a fatal error.
 *
 * @param {string} message
 * @throws {Error}
 */
export function throws(message) {
  throw new Error(marker + message)
}


/**
 * Throws an error if the supplied test is null or undefined.
 *
 * @template T
 * @param {T} test
 * @param {string} message
 * @returns {asserts test is NonNullable<T>}
 */
export function assert(test, message) {
  if (test === undefined || test === null) throws(message)
}

/**
 * Logs out a warning to the console.
 *
 * @param {string} original
 * @param {string} [replacement]
 */
export function deprecate(original, replacement = '') {
  let message = `\`${original}\` has been depreciated.`

  if (replacement !== '') message += `Use \`${replacement}\` instead.`

  warnOnce(message)
}