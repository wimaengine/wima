/**
 * @param {string} url
 * @returns {string}
 */
export function getFileName(url){
  const prelude = url.split('/').pop()

  if(!prelude)return ''

  return prelude.split('.')[0]
}

/**
 * @param {string} url
 * @returns {string}
 */
export function getFileExtension(url){
  const prelude = url.split('.').pop()

  if(!prelude) return ''

  return prelude
}