import { readFileSync } from 'fs';

const { pr } = danger.github;
const repoURL = pr.head.repo.html_url;
const ref = pr.head.ref;

export const formatFilename = file => `\`${file}\``;

export const formatFilenames = files => files.map(formatFilename).join(', ');

export const linkToFile = (file, line) => {
  const lineId = line ? `#L${line}` : '';
  return `[${file}${lineId}](${repoURL}/blob/${ref}/${file}${lineId})`;
};

export const findTerm = (term, content) => {
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

export const findFirstTerm = (terms, content) => {
  for (let i = terms.length; i--; ) {
    const [term, line] = findTerm(terms[i], content);
    if (term) return [term, line];
  }
  return [];
};

export const findTermsOnFiles = (terms, files) =>
  files
    .map(file => {
      let [term, line] = findFirstTerm(terms, readFileSync(file).toString());
      if (line) return [file, term, line];
      return null;
    })
    .filter(Boolean);

export const checkTerms = ({ files, terms, formatter }) => {
  return findTermsOnFiles(terms, files).reduce((acc, [file, term, line]) => {
    acc.push([formatter(term, file, line), file, line]);
    return acc;
  }, []);
};
