import { keepachangelog } from 'danger-plugin-keepachangelog';

import * as Collections from './collections.js';
import * as Utils from './utils.js';
import * as Rules from './rules.js';

import { setConfig } from './config.js';

const ruleMap = {
  description: Rules.checkDescription,
  assignee: Rules.checkAssignee,
  reviewers: Rules.checkReviewers,
  pr_size: Rules.checkPRSize,
  lock_file: Rules.checkLockFileUpdated,
  no_dot_only: Rules.noDotOnly,
  no_console_log: Rules.noConsoleLog,
  no_debugger: Rules.noDebugger,
  enforce_graphql_provider: Rules.enforceGraphQLProvider,
};

export function assert(opts) {
  if (danger.github.pr.user.type === 'Bot') {
    return;
  }

  const config = setConfig(opts);

  if (config.keepachangelog) {
    keepachangelog();
  }

  for (const [rule, options] of Object.entries(config.rules)) {
    const [level, ruleOptions] = Array.isArray(options) ? options : [options];

    if (!level || level === 'off') continue;

    const result = []
      .concat(ruleMap[rule](ruleOptions))
      .filter(Boolean)
      .map(i => (Array.isArray(i) ? i : [i]));

    for (const [text, file, line] of result) {
      if (level === 'info') {
        message(text, file, line);
        continue;
      }

      if (level === 'warn') {
        warn(text, file, line);
        continue;
      }

      if (level === 'fail') {
        fail(text, file, line);
        continue;
      }

      throw new Error(`Invalid log level at rule '${rule}'`);
    }
  }
}

export { Collections, Utils };
