import { Window, MainWindow } from '../components'

/**
 * @returns {[Window,MainWindow]}
 */
export function createMainWindow() {

  return [new Window(), new MainWindow()]
}
