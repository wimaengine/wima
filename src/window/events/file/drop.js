export class FileDrop {

  /**
   * @readonly
   * @type {FileList}
   */
  path

  /**
   * @param {DragEvent} event 
   */
  constructor(event){
    this.path = event.dataTransfer?.files || new FileList()
  }
}