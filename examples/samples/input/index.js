const keyboard = new URL("./keyboard.js", import.meta.url)
const mouse = new URL("./mouse.js", import.meta.url)
const touch = new URL("./touch.js", import.meta.url)

export default {
  "keyboard": keyboard,
  "mouse": mouse,
  "touch": touch
}
