const { readFileSync } = require('fs');

const { pr } = danger.github;
const repoURL = pr.head.repo.html_url;
const ref = pr.head.ref;

exports.formatFilename = file => `\`${file}\``;

exports.formatFilenames = files => files.map(exports.formatFilename).join(', ');

exports.linkToFile = (file, line) => {
  const lineId = line ? `#L${line}` : '';
  return `[${file}${lineId}](${repoURL}/blob/${ref}/${file}${lineId})`;
};

exports.findTerm = (term, content) => {
  let index;
  if (term instanceof RegExp) {
    const match = content.match(term);
    if (!match) return [];
    index = match.index;
    // replace the regexp with what matched
    term = match[0];
  } else {
    index = content.indexOf(term);
    if (index === -1) return [];
  }
  const line = content.substring(0, index).split('\n').length;
  return [term, line];
};

exports.findFirstTerm = (terms, content) => {
  for (let i = terms.length; i--; ) {
    const [term, line] = exports.findTerm(terms[i], content);
    if (term) return [term, line];
  }
  return [];
};

exports.findTermsOnFiles = (terms, files) =>
  files
    .map(file => {
      let [term, line] = exports.findFirstTerm(
        terms,
        readFileSync(file).toString()
      );
      if (line) return [file, term, line];
      return null;
    })
    .filter(Boolean);
