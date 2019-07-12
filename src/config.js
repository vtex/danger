let currentConfig;

export const defaultConfig = {
  rules: {
    file_changes: [
      'info',
      {
        created: true,
        deleted: true,
        modified: true,
      },
    ],
    changelog: [
      'fail',
      {
        path: 'CHANGELOG.md',
      },
    ],
    description: ['fail', { minLength: 20 }],
    wip: 'fail',
    assignee: 'warn',
    reviewers: 'warn',
    pr_size: [
      'warn',
      {
        additionLimit: 800,
        deletionLimit: -1,
      },
    ],
    lock_file: 'warn',
    need_rebase: 'warn',
    dot_only: [
      'fail',
      {
        pattern: /test|spec/i,
      },
    ],
    console_log: [
      'warn',
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
