const marker = '🚀Chaos Engine:\n\n'
const mess = ['']

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