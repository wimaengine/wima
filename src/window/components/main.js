export class MainWindow {

  /**
   * @param {MainWindow} source
   * @param {MainWindow} target
   */
  static copy(source, target = new MainWindow()) {
    return target
  }

  /**
   * @param {MainWindow} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
