const { git } = danger;

export const modifiedFiles = git.modified_files;
export const createdFiles = git.created_files;
export const deletedFiles = git.deleted_files;

export const existingFiles = modifiedFiles
  .concat(createdFiles)
  .filter(file => 'dangerfile.js' !== file);
export const allFiles = existingFiles.concat(deletedFiles);