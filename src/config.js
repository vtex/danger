let currentConfig;

export const defaultConfig = {
  rules: {
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
    no_dot_only: [
      'fail',
      {
        filePattern: /test|spec/i,
      },
    ],
    no_console_log: [
      'warn',
      {
        filePattern: /\.[tj]sx?$/i,
      },
    ],
    no_debugger: [
      'fail',
      {
        filePattern: /\.[tj]sx?$/i,
      },
    ],
    enforce_graphql_provider: 'fail',
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
