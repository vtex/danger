import { basename } from 'path';

import { linkToFile, findTermsInfile, findAndFormatTerms } from './utils.js';
import { modifiedFiles, existingFiles } from './collections.js';

export const {
  github: { pr, thisPR, requested_reviewers: requestedReviewers },
} = danger;

export function checkDescription({ minLength = 20 }) {
  if (pr.body.length < minLength) {
    return ':pencil: Please add a description to your PR.';
  }
}

export function checkAssignee() {
  if (pr.assignee === null) {
    return ':bust_in_silhouette: Please assign someone to merge this PR, and optionally include people who should review.';
  }
}

export function checkReviewers() {
  if (!thisPR || !requestedReviewers) return;

  const reviewers = [
    ...requestedReviewers.teams.map(
      requestedTeam => `@${thisPR.owner}/${requestedTeam}`
    ),
    ...requestedReviewers.users.map(requestedUser => `@${requestedUser}`),
  ];

  if (reviewers.length === 0) {
    return `:busts_in_silhouette: There are no reviewers assigned to this pull request!`;
  }
}

export async function checkPRSize({ additionLimit = 420, deletionLimit = 0 }) {
  const { data: fileList } = await danger.github.api.pulls.listFiles({
    owner: danger.github.thisPR.owner,
    repo: danger.github.thisPR.repo,
    pull_number: danger.github.thisPR.number,
  });

  const nChanges = fileList
    .filter(f => {
      const filename = basename(f.filename);
      return filename !== 'package-lock.json' && filename !== 'yarn.lock';
    })
    .reduce((acc, file) => acc + file.additions + file.deletions, 0);

  const modificationLimit =
    Math.max(0, additionLimit) + Math.max(0, deletionLimit);

  if (nChanges > modificationLimit) {
    return `:eyes: Pull Request size seems relatively large (**>${modificationLimit}** modifications). If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.`;
  }
}

export function checkLockFileUpdated() {
  const packageChanged = modifiedFiles.includes('package.json');
  const lockfileChanged = modifiedFiles.includes('yarn.lock');

  if (packageChanged && !lockfileChanged) {
    return 'Changes were made to package.json, but not to yarn.lock - <em>Perhaps you need to run `yarn install`?</em>';
  }
}

export function noDotOnly({ filePattern }) {
  return findAndFormatTerms({
    files: existingFiles.filter(file => file.match(filePattern)),
    terms: [
      'it.only',
      'it.skip',
      'test.only',
      'test.skip',
      'describe.only',
      'describe.skip',
      'fdescribe',
      'fit(',
    ],
    formatter(file, term, line) {
      return `A \`${term}\` was left in ${linkToFile(file, line)}`;
    },
  });
}

export function noConsoleLog({ filePattern }) {
  return findAndFormatTerms({
    files: existingFiles.filter(file => file.match(filePattern)),
    terms: ['console.log'],
    formatter(file, term, line) {
      return `A wild \`${term}\` has appeared on ${linkToFile(
        file,
        line
      )}. Is it supposed to be here?`;
    },
  });
}

export function noDebugger({ filePattern }) {
  return findAndFormatTerms({
    files: existingFiles.filter(file => file.match(filePattern)),
    terms: [/^\s+?(debugger;?)$/m],
    formatter(file, term, line) {
      return `Is this a \`${term}\` that I see on ${linkToFile(file, line)}?`;
    },
  });
}

export function enforceGraphQLProvider() {
  const graphqlFiles = existingFiles.filter(file =>
    file.match(/\.(gql|graphql)$/)
  );

  if (graphqlFiles.length === 0) return;

  const filesMatches = findTermsInfile({
    files: graphqlFiles,
    terms: [/provider:\s+?["'].*?["']/],
  });

  if (filesMatches.length === 0) return;

  return filesMatches.map(
    ([file]) =>
      `No \`@context(provider: "...")\` found on ${linkToFile(
        file
      )}. Please explicitly declare the query provider.`
  );
}
