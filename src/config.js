const FAIL = 'fail';
const WARN = 'warn';
const INFO = 'info';

let currentConfig;

export const defaultConfig = {
  matchers: {
    test_files: path => path.match(/test|spec/i),
    code_files: path => path.match(/\.[tj]sx?$/i),
  },
  rules: {
    file_changes: [
      INFO,
      {
        created: true,
        deleted: true,
        modified: true,
      },
    ],
    changelog: FAIL,
    description: [FAIL, { minLength: 20 }],
    wip: FAIL,
    assignee: FAIL,
    reviewers: FAIL,
    pr_size: [
      WARN,
      {
        additionLimit: 800,
        deletionLimit: -1,
      },
    ],
    lock_file: WARN,
    need_rebase: WARN,
    dot_only: FAIL,
    console_log: WARN,
  },
};

export const getConfig = () => currentConfig;

export const setConfig = config => {
  return (currentConfig = Object.assign({}, defaultConfig, config));
};

export const matchFiles = (matcherId, files) =>
  files.filter(currentConfig.matchers[matcherId]);
