import * as Collections from './collections.js';
import * as Utils from './utils.js';
import * as Rules from './rules.js';

import { setConfig } from './config.js';

const ruleMap = {
  file_changes: Rules.showFileChanges,
  changelog: Rules.checkChangelog,
  description: Rules.checkDescription,
  wip: Rules.checkWIP,
  assignee: Rules.checkAssignee,
  reviewers: Rules.checkReviewers,
  pr_size: Rules.checkPRSize,
  lock_file: Rules.checkLockFileUpdated,
  need_rebase: Rules.checkMergeability,
  dot_only: Rules.checkTestFiles,
  console_log: Rules.checkConsoleLog,
};

export function assert(config) {
  const { rules } = setConfig(config);

  Object.entries(rules).forEach(([rule, options]) => {
    const [level, ruleOptions] = Array.isArray(options) ? options : [options];
    const result = []
      .concat(ruleMap[rule](ruleOptions))
      .filter(Boolean)
      .map(i => (Array.isArray(i) ? i : [i]));

    result.forEach(([text, file, line]) => {
      if (level === 'info') return message(text, file, line);
      if (level === 'warn') return warn(text, file, line);
      if (level === 'fail') return fail(text, file, line);
      throw new Error(`Invalid log level at rule '${rule}'`);
    });
  });
}

export { Collections as collections, Utils as utils };
