const { keepachangelog } = require('danger-plugin-keepachangelog')

const Collections = require('./collections.js')
const Utils = require('./utils.js')
const Rules = require('./rules.js')
const { setConfig } = require('./config.js')

const ruleMap = {
  description: Rules.checkDescription,
  assignee: Rules.checkAssignee,
  reviewers: Rules.checkReviewers,
  pr_size: Rules.checkPRSize,
  lock_file: Rules.checkLockFileUpdated,
  no_ignored_test: Rules.noIgnoredTest,
  no_debugger: Rules.noDebugger,
  enforce_graphql_provider: Rules.enforceGraphQLProvider,
}

exports.verify = async (opts) => {
  if (danger.github.pr.user.type === 'Bot') {
    return
  }

  const config = setConfig(opts)

  if (config.keepachangelog) {
    const pluginOpts =
      typeof config.keepachangelog === 'object' ? config.keepachangelog : {}

    keepachangelog(pluginOpts)
  }

  for await (const [rule, options] of Object.entries(config.rules)) {
    const [level, ruleOptions] = Array.isArray(options) ? options : [options]

    if (!level || level === 'off') continue

    const result = []
      .concat(await ruleMap[rule](ruleOptions))
      .filter(Boolean)
      .map((i) => (Array.isArray(i) ? i : [i]))

    for (const [text, file, line] of result) {
      if (level === 'info') {
        message(text, file, line)
        continue
      }

      if (level === 'warn') {
        warn(text, file, line)
        continue
      }

      if (level === 'fail') {
        fail(text, file, line)
        continue
      }

      throw new Error(`Invalid log level at rule '${rule}'`)
    }
  }
}

exports.Collections = Collections
exports.Utils = Utils
