import { exec } from "child_process"
import { writeFileSync } from "fs"
import { resolve } from "path"


class Author {
  /**
   * @type {string}
   */
  name
  /**
   * @type {string}
   */
  mail
  /**
   * 
   * @param {string} name 
   * @param {string} mail 
   */
  constructor(name,mail) {
    this.name = name
    this.mail = mail
  }
}

class Commit {
  /**
   * @type {string}
   */
  hash
  /**
   * @type {Author}
   */
  author
  /**
   * @type {CommitMessage}
   */
  message
  /**
   * @type {Date}
   */
  date
  /**
   * 
   * @param {string} hash 
   * @param {CommitMessage} message 
   * @param {Author} author
   * @param {Date} date
   */
  constructor(hash,message,author,date) {
    this.hash = hash
    this.message = message
    this.author = author
    this.date = date
  }
}

class CommitMessage {
  /**
   * @type {string}
   */
  scope
  /**
   * @type {string}
   */
  value
  /**
   * @type {string[]}
   */
  tags
  /**
   * @param {string} scope 
   * @param {string} message 
   * @param {string[]} tags
   */
  constructor(scope,message,tags) {
    this.scope = scope
    this.value = message
    this.tags = tags
  }
}
/**
 * @param {string} string
 */
function findScope(string) {
  const i1 = string.search("\\[")
  const i2 = string.search("\\]")

  const scope = string.substring(i1 + 1,i2)

  return scope.trim().toLowerCase()
}

/**
 * @param {string} string
 */
function findMessage(string) {
  const a = string.substring(string.search("\\]")).split(" ")
  const c = []

  for (let i = a.length - 1; i > 0; i--) {
    const b = a[i]

    if (b.includes("#")) continue
    c.unshift(b)
  }

  return c.join(" ").trim()
}

/**
 * @param {string} string
 */
function findTags(string) {
  const a = string.split(" ")
  const c = []

  a.splice(0,1)
  for (let i = a.length - 1; i > 0; i--) {
    const b = a[i]

    if (!b.includes("#")) continue
    c.push(b)
  }

  return c
}

/**
 * @param {string} commitMessage
 * 
 * @returns {CommitMessage}
 */
function parseCommitMessage(commitMessage) {
  const commit = commitMessage.trim()
  const scope = findScope(commit)
  const value = findMessage(commit)
  const tags = findTags(commit)

  return new CommitMessage(scope,value,tags)
}

/**
 * @param {string[]} authorstring
 * 
 * @returns {Author}
 */
function parseAuthor(authorstring) {
  for (let i = 0; i < authorstring.length; i++) {
    const element = authorstring[i]

    if (element.includes("Author")) {
      const parts = element.split(" ")

      return new Author(parts[1],parts[2])
    }
  }
  return new Author('','')
}

/**
 * @param {string} raw
 */
function parseDate(raw) {
  for (let i = 0; i < raw.length; i++) {
    const element = raw[i]

    if (element.includes("Date")) return element.split(" ").splice(1)
      .join(" ")
      .trim()
  }
  return ''
}

/**
 * @param {string[]} raw
 */
function parseMessage(raw) {
  let message = ""

  for (let i = 0; i < raw.length; i++) {
    const element = raw[i]

    if (
      element === "" ||
      element.includes("Date") ||
      element.includes("Author") ||
      element.includes("Merge")
    ) continue
    message = message.concat(element.trim()).replace("\n"," ")
  }

  return message
}

/**
 * @param {string} commit
 * @returns {Commit}
 */
function parseCommit(commit) {
  const parts = commit.split("\n").filter(v => {
    if (v !== "") return v
  })

  if (parts.length < 4) return null
  const message = parseMessage(parts)

  return new Commit(
    parts[0].trim(),
    parseCommitMessage(message),
    parseAuthor(parts),
    parseDate(parts),
  )
}

/**
 * @param {string} log
 * @returns {Commit[]}
 */
function parseGitLog(log) {
  const raw = log
    .split("commit")
    .filter((v) => v !== "")
  const processed = raw
    .map(v => parseCommit(v))
    .filter(v => v != void 0)

  return processed
}

function checkTags(tags,ignore) {
  for (const tag of tags) {
    for (const tag2 of ignore) {
      if (tag === tag2) return true
    }
  }

  return false
}

/**
 * @param {Commit[]} log
 * @returns {string}
 */
function getchangelog(log,settings) {
  const { ignoreTags,ignoreScopes } = settings
  let changelog = ""

  for (let i = 0; i < log.length; i++) {
    const commit = log[i]
    const scope = commit.message.scope
    const tags = commit.message.tags

    if (
      ignoreScopes.includes(scope) ||
      checkTags(tags,ignoreTags)
    ) continue
    if (scope === "build")
      changelog = changelog.concat("\n ## " + commit.message.value + "\n\n")
    else
      changelog = changelog.concat(" - " + commit.message.value + "\n")
  }

  return changelog
}

export function generateChangeLog(settings = {}) {
  if (!settings.ignoreTags) settings.ignoreTags = []
  if (!settings.ignoreScopes) settings.ignoreScopes = []
  if (!settings.output) settings.output = "changelog.md"

  exec("git log",(err,sdout,sterr) => {
    if (err)
      if (sterr) throw new Error(err + '\n' + sterr)

    const log = parseGitLog(sdout)
    const changelog = getchangelog(log,settings)

    writeFileSync(resolve(process.cwd(),settings.output),changelog)
  })
}