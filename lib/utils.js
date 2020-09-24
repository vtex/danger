const { readFileSync } = require('fs')
const { basename } = require('path')

const { pr } = danger.github
const repoURL = pr.head.repo.html_url
const { ref } = pr.head

exports.formatFilename = (file) => `\`${file}\``

exports.formatFilenames = (files) =>
  files.map(exports.formatFilename).join(', ')

exports.linkToFile = (file, line, fullPathLabel = false) => {
  const lineId = line ? `#L${line}` : ''
  const linkLabel = fullPathLabel ? file : basename(file)

  return `[${linkLabel}${lineId}](${repoURL}/blob/${ref}/${file}${lineId})`
}

const findPattern = (pattern, content) => {
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gm')
  } else if (!pattern.global) {
    pattern = new RegExp(pattern.source, `${pattern.flags}g`)
  }

  pattern.lastIndex = 0

  const result = []
  let match

  while ((match = pattern.exec(content))) {
    // replace the regexp with what matched
    // use first capture group if available
    const matchedTerm = match[1] || match[0]
    const line = content.substring(0, match.index).split('\n').length

    result.push([matchedTerm, line])
  }

  return result
}

const findPatterns = (patterns, content) => {
  patterns = Array.isArray(patterns) ? patterns : [patterns]

  return patterns.reduce(
    (acc, pattern) => acc.concat(findPattern(pattern, content)),
    []
  )
}

exports.findTermsInfile = ({ files, terms }) => {
  return files.map((file) => {
    const content = readFileSync(file).toString()

    return [file, findPatterns(terms, content)]
  })
}

exports.findAndFormatTerms = ({ files, terms, formatter }) => {
  return exports
    .findTermsInfile({ files, terms })
    .reduce((acc, [file, matches]) => {
      return acc.concat(
        matches.map(([term, line]) => [formatter(file, term, line), file, line])
      )
    }, [])
}
