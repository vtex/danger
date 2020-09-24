const { basename } = require('path')

const {
  linkToFile,
  findTermsInfile,
  findAndFormatTerms,
} = require('./utils.js')
const { modifiedFiles, existingFiles } = require('./collections.js')

const {
  github: { pr, thisPR, requested_reviewers: requestedReviewers, reviews },
} = danger

exports.checkDescription = ({ minLength = 20 }) => {
  if (pr.body.length < minLength) {
    return ':pencil: Please add a description to your PR.'
  }
}

exports.checkAssignee = () => {
  if (pr.assignee === null) {
    return ':bust_in_silhouette: Please assign someone to merge this PR, and optionally include people who should review.'
  }
}

exports.checkReviewers = () => {
  if (!thisPR || !requestedReviewers) return

  const reviewers = [
    ...requestedReviewers.teams.map(
      (requestedTeam) => `@${thisPR.owner}/${requestedTeam}`
    ),
    ...requestedReviewers.users.map((requestedUser) => `@${requestedUser}`),
  ]

  if (reviewers.length === 0 && reviews.length === 0) {
    return `:busts_in_silhouette: There are no reviewers assigned to this pull request!`
  }
}

exports.checkPRSize = async ({ additionLimit = 420, deletionLimit = 0 }) => {
  const { data: fileList } = await danger.github.api.pulls.listFiles({
    owner: danger.github.thisPR.owner,
    repo: danger.github.thisPR.repo,
    pull_number: danger.github.thisPR.number,
  })

  const nChanges = fileList
    .filter((f) => {
      const filename = basename(f.filename)

      return filename !== 'package-lock.json' && filename !== 'yarn.lock'
    })
    .reduce((acc, file) => acc + file.additions + file.deletions, 0)

  const modificationLimit =
    Math.max(0, additionLimit) + Math.max(0, deletionLimit)

  if (nChanges > modificationLimit) {
    return `:eyes: The size of this pull request seems relatively large (**>${modificationLimit}** modifications). Consider splitting it into smaller pull requests to help make reviews easier and faster.`
  }
}

exports.checkLockFileUpdated = () => {
  const packageChanged = modifiedFiles.includes('package.json')
  const lockfileChanged = modifiedFiles.includes('yarn.lock')

  if (packageChanged && !lockfileChanged) {
    return 'Changes were made to package.json, but not to yarn.lock - <em>Perhaps you need to run `yarn install`?</em>'
  }
}

exports.noIgnoredTest = ({ filePattern }) => {
  return findAndFormatTerms({
    files: existingFiles.filter((file) => file.match(filePattern)),
    terms: [/(?:it|test|describe)\.(?:only|skip)/, /[xf]it\(/, 'fdescribe'],
    formatter(file, term, line) {
      return `A \`${term}\` was left in ${linkToFile(file, line)}`
    },
  })
}

exports.noDebugger = ({ filePattern }) => {
  return findAndFormatTerms({
    files: existingFiles.filter((file) => file.match(filePattern)),
    terms: [/^\s+?(debugger;?)$/m],
    formatter(file, term, line) {
      return `Is this a \`${term}\` that I see on ${linkToFile(file, line)}?`
    },
  })
}

exports.enforceGraphQLProvider = () => {
  const graphqlFiles = existingFiles.filter((file) =>
    file.match(/react.*?\.(gql|graphql)$/)
  )

  if (graphqlFiles.length === 0) return

  const filesMatches = findTermsInfile({
    files: graphqlFiles,
    terms: [/provider:\s+?["'].*?["']/],
  })
    // filter out files that has "context provider"
    .filter(([, matches]) => matches.length === 0)

  if (filesMatches.length === 0) return

  return filesMatches.map(
    ([file]) =>
      `No \`@context(provider: "...")\` found on ${linkToFile(
        file
      )}. Please explicitly declare the query provider.`
  )
}
