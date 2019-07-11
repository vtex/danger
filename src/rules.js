import { formatFilenames, linkToFile, checkTerms } from './utils.js';
import { matchFiles } from './config.js';
import {
  modifiedFiles,
  deletedFiles,
  createdFiles,
  existingFiles,
} from './collections.js';

export const {
  github: { pr, thisPR, requested_reviewers },
} = danger;

export function showFileChanges({
  created = true,
  deleted = true,
  modified = true,
}) {
  const msg = [
    modified &&
      modifiedFiles.length &&
      `:art: **Changed Files**:\n${formatFilenames(modifiedFiles)}`,
    created &&
      createdFiles.length &&
      `:sparkles: **Created Files**:\n${formatFilenames(createdFiles)}`,
    deleted &&
      deletedFiles.length &&
      `:fire: **Deleted Files**:\n${formatFilenames(deletedFiles)}`,
  ]
    .filter(Boolean)
    .join('\n\n');
  return msg;
}

export function checkChangelog() {
  const hasChangelog =
    modifiedFiles.includes('CHANGELOG.md') ||
    createdFiles.includes('CHANGELOG.md');
  if (!hasChangelog) {
    return ':pencil: Please add a changelog entry for your changes.';
  }
}

export function checkDescription({ minLength = 20 }) {
  if (pr.body.length < minLength) {
    return ':pencil: Please add a description to your PR.';
  }
}

export function checkWIP() {
  if (pr.title.match(/wip/i)) {
    return ':construction: Pull request is currently a **Work In Progress**.';
  }
}

export function checkAssignee() {
  if (pr.assignee === null) {
    return ':bust_in_silhouette: Please assign someone to merge this PR, and optionally include people who should review.';
  }
}

export function checkReviewers() {
  if (!thisPR || !requested_reviewers) return;

  const reviewers = [
    ...requested_reviewers.teams.map(
      requestedTeam => `@${thisPR.owner}/${requestedTeam}`
    ),
    ...requested_reviewers.users.map(requestedUser => `@${requestedUser}`),
  ];

  if (reviewers.length === 0) {
    return `:busts_in_silhouette: There are no reviewers assigned to this pull request!`;
  } else {
    return `:heavy_check_mark: Assigned reviewers:\n-${reviewers.join('\n -')}`;
  }
}

export function checkPRSize({ additionLimit = 800, deletionLimit = 0 }) {
  const modificationLimit =
    Math.max(0, additionLimit) + Math.max(0, deletionLimit);

  if (pr.additions + pr.deletions > modificationLimit) {
    return `:eyes: Pull Request size seems relatively large (**>${modificationLimit}** modifications). If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.`;
  }
}

export function checkTestFiles() {
  return checkTerms({
    files: matchFiles('test_files', existingFiles),
    terms: ['it.only', 'describe.only', 'fdescribe', 'fit('],
    formatter(term, file, line) {
      return `An \`${term}\` was left in this file ${linkToFile(file, line)}`;
    },
  });
}

export function checkConsoleLog() {
  return checkTerms({
    files: matchFiles('code_files', existingFiles),
    terms: ['console.log'],
    formatter(term, file, line) {
      return `A wild \`${term}\` has appeared on this file: ${linkToFile(
        file,
        line
      )}. Is this supposed to be here?`;
    },
  });
}

export function checkLockFileUpdated() {
  const packageChanged = modifiedFiles.includes('package.json');
  const lockfileChanged = modifiedFiles.includes('yarn.lock');

  if (packageChanged && !lockfileChanged) {
    return 'Changes were made to package.json, but not to yarn.lock - <em>Perhaps you need to run `yarn install`?</em>';
  }
}

export function checkMergeability() {
  if (!pr.mergeable_state === 'dirty') {
    return `“Branch is not rebased with \`${pr.base.ref}\`.`;
  }
}
