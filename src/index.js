const {
  formatFilenames,
  linkToFile,
  findTerm,
  findFirstTerm,
  findTermsOnFiles,
} = require('./utils.js');

const {
  git,
  github: { pr, thisPR, requested_reviewers },
} = danger;

const modifiedFiles = git.modified_files;
const createdFiles = git.created_files;
const deletedFiles = git.deleted_files;

const existingFiles = modifiedFiles
  .concat(createdFiles)
  .filter(file => !['dangerfile.js'].includes(file));
const allFiles = existingFiles.concat(deletedFiles);
const testFiles = existingFiles.filter(path => path.includes('test'));
const codeFiles = existingFiles.filter(file => file.match(/\.[tj]sx?$/i));

function showFileChanges({ created = true, deleted = true, modified = true }) {
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
  message(msg);
}

function checkChangelog() {
  const hasChangelog =
    modifiedFiles.includes('CHANGELOG.md') ||
    createdFiles.includes('CHANGELOG.md');
  if (!hasChangelog) {
    fail(':pencil: Please add a changelog entry for your changes.');
  }
}

function checkDescription({ minLength = 20 }) {
  if (pr.body.length < minLength) {
    fail(':pencil: Please add a description to your PR.');
  }
}

function checkWIP() {
  if (pr.title.match(/wip/i)) {
    warn(':construction: Pull request is currently a **Work In Progress**.');
  }
}

function checkAssigneeAndReviewers() {
  if (pr.assignee === null) {
    fail(
      ':bust_in_silhouette: Please assign someone to merge this PR, and optionally include people who should review.'
    );
  }

  if (!thisPR || !requested_reviewers) return;

  const reviewers = [
    ...requested_reviewers.teams.map(
      requestedTeam => `@${thisPR.owner}/${requestedTeam}`
    ),
    ...requested_reviewers.users.map(requestedUser => `@${requestedUser}`),
  ];

  if (reviewers.length === 0) {
    warn(
      `:busts_in_silhouette: There are no reviewers assigned to this pull request!`
    );
  } else {
    message(
      `:heavy_check_mark: Assigned reviewers:\n-${reviewers.join('\n -')}`
    );
  }
}

function checkPRSize({ additionLimit = 800, deletionLimit = 0 }) {
  const modificationLimit = additionLimit + deletionLimit;
  if (pr.additions + pr.deletions > modificationLimit) {
    warn(
      `:eyes: Pull Request size seems relatively large (**>${modificationLimit}** modifications). If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.`
    );
  }
}

function checkTerms({ files, terms, formatter, fail: shouldFail = false }) {
  const logMethod = shouldFail ? fail : warn;
  findTermsOnFiles(terms, files).forEach(([file, term, line]) => {
    logMethod(formatter(term, file, line), file, line);
  });
}

function checkTestFiles() {
  checkTerms({
    files: testFiles,
    terms: ['it.only', 'describe.only', 'fdescribe', 'fit('],
    fail: true,
    formatter(term, file, line) {
      return `An \`${term}\` was left in this file ${linkToFile(file, line)}`;
    },
  });
}

function checkConsoleLog() {
  checkTerms({
    files: codeFiles,
    terms: ['console.log'],
    formatter(term, file, line) {
      return `A wild \`${term}\` has appeared on this file: ${linkToFile(
        file,
        line
      )}. Is this supposed to be here?`;
    },
  });
}

function checkLockFileUpdated() {
  const packageChanged = modifiedFiles.includes('package.json');
  const lockfileChanged = modifiedFiles.includes('yarn.lock');

  if (packageChanged && !lockfileChanged) {
    warn(
      'Changes were made to package.json, but not to yarn.lock - <em>Perhaps you need to run `yarn install`?</em>'
    );
  }
}

function checkMergeability() {
  if (!pr.mergeable_state === 'dirty') {
    fail(`“Branch is not rebased with \`${pr.base.ref}\`?`);
  }
}

exports.rules = {
  showFileChanges,
  checkChangelog,
  checkDescription,
  checkWIP,
  checkAssigneeAndReviewers,
  checkPRSize,
  checkTerms,
  checkTestFiles,
  checkLockFileUpdated,
  checkConsoleLog,
  checkMergeability,
};

exports.collections = {
  modifiedFiles,
  createdFiles,
  deletedFiles,
  existingFiles,
  allFiles,
  testFiles,
  codeFiles,
};

exports.utils = {
  linkToFile,
  findTerm,
  findFirstTerm,
  findTermsOnFiles,
};
