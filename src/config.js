let currentConfig;

export const defaultConfig = {
  rules: {
    file_changes: [
      'off',
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
    no_dot_only: [
      'fail',
      {
        pattern: /test|spec/i,
      },
    ],
    no_console_log: [
      'warn',
      {
        pattern: /\.[tj]sx?$/i,
      },
    ],
    no_debugger: [
      'fail',
      {
        pattern: /\.[tj]sx?$/i,
      },
    ],
    enforce_graphql_provider: 'fail'
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
