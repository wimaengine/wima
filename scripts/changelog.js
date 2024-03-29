import { generateChangeLog } from "./git/index.js"

generateChangeLog({
  ignoreTags: [
    "#ignore",
    "#internal",
    "#refactor"
    ],
  ignoreScopes: [
    "",
    "documentation",
    "demos",
    "config",
    "script"
    ]
})