const { git } = danger

exports.modifiedFiles = git.modified_files
exports.createdFiles = git.created_files
exports.deletedFiles = git.deleted_files

exports.existingFiles = exports.modifiedFiles
  .concat(exports.createdFiles)
  .filter((file) => 'dangerfile.js' !== file)
exports.allFiles = exports.existingFiles.concat(exports.deletedFiles)
