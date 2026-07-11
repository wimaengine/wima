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
    return MainWindow.copy(target)
  }

  /**
   * @param {MainWindow} _value
   */
  static serialize(_value) {
    return {}
  }

  /**
   * @param {unknown} _value
   * @param {MainWindow} [out]
   */
  static deserialize(_value, out = new MainWindow()) {
    return out
  }
}
