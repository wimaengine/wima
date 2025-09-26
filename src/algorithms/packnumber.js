/**
 * Packs two numbers into a single number.
 * 
 * #### Note
 * This operation is should be analogous to packing two 32 bit
 * numbers into a 64 bit number in the high and low bits.Due
 * to language limitations, the high bits of this implementation
 * can only be up to 2 ^ 20, otherwise the output will be garbled
 * nonsense.
 * 
 * @param {number} low 
 * @param {number} high
 * @returns 
 */
export function packInto64Int(low, high) {

  // We cant use bit manipulation as javascript has a 32 bit limit on
  // manipulating "integers"
  return (high * 2 ** 32) + low
}