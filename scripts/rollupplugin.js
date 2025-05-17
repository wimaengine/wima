export function addJsdocExports(){
    return {
      name:'remove-jsdoc-import',
      transform(_code,path){
        if (path.includes('typedef')) {
          return {
            moduleSideEffects:'no-treeshake'
          }
        }
      }
    }
  }