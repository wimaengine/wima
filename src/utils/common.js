let tmpID = 0
 
/**
 * Generates a unique id starting from 0 when called.
 *
 * @returns {number}
 */
export function generateIDBasic() {
  return (tmpID += 1)
}
