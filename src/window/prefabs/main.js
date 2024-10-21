import { Window, MainWindow } from '../components/index.js'

/**
 * @returns {[Window,MainWindow]}
 */
export function createMainWindow() {
  
  return [new Window(), new MainWindow()]
}