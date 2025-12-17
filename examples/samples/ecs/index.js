const spawn = new URL("./spawn.js", import.meta.url)
const despawn = new URL("./despawn.js", import.meta.url)

export default {
  "spawn": spawn,
  "despawn": despawn
}
