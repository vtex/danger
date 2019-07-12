const FAIL = 'fail';
const WARN = 'warn';
const INFO = 'info';

let currentConfig;

export const defaultConfig = {
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
    assignee: WARN,
    reviewers: WARN,
    pr_size: [
      WARN,
      {
        additionLimit: 800,
        deletionLimit: -1,
      },
    ],
    lock_file: WARN,
    need_rebase: WARN,
    dot_only: [
      FAIL,
      {
        pattern: /test|spec/i,
      },
    ],
    console_log: [
      WARN,
      {
        pattern: /\.[tj]sx?$/i,
      },
    ],
  },
};

export const getConfig = () => currentConfig;

export const setConfig = config => {
  currentConfig = {
    ...defaultConfig,
    ...(config || {}),
    rules: {
      ...defaultConfig.rules,
      ...(config && config.rules),
    },
  };
  return currentConfig;
};
