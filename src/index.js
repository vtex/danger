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

  for (const [rule, options] of Object.entries(rules)) {
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

export { Collections as collections, Utils as utils };
