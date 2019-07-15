import { readFileSync } from 'fs';
import { basename } from 'path';

const { pr } = danger.github;
const repoURL = pr.head.repo.html_url;
const ref = pr.head.ref;

export const formatFilename = file => `\`${file}\``;

export const formatFilenames = files => files.map(formatFilename).join(', ');

export const linkToFile = (file, line, fullPathLabel = false) => {
  const lineId = line ? `#L${line}` : '';
  const linkLabel = fullPathLabel ? file : basename(file);
  return `[${linkLabel}${lineId}](${repoURL}/blob/${ref}/${file}${lineId})`;
};

const findTerm = (term, content) => {
  let index;
  if (term instanceof RegExp) {
    const match = term.exec(content);
    if (!match) return [];
    index = match.index;
    // replace the regexp with what matched
    // use first capture group if available
    term = match[1] || match[0];
  } else {
    index = content.indexOf(term);
    if (index === -1) return [];
  }
  const line = content.substring(0, index).split('\n').length;
  return [term, line];
};

const findFirstTerm = (terms, content) => {
  for (let i = terms.length; i--; ) {
    const [term, line] = findTerm(terms[i], content);
    if (term) return [term, line];
  }
  return [];
};

const findTermsOnFiles = (terms, files) =>
  files
    .map(file => {
      let [term, line] = findFirstTerm(terms, readFileSync(file).toString());
      if (line) return [file, term, line];
      return null;
    })
    .filter(Boolean);

export const searchForTerms = ({ files, terms, formatter }) => {
  return findTermsOnFiles(terms, files).map(([file, term, line]) => {
    return [formatter(term, file, line), file, line];
  });
};
