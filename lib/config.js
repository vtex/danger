let currentConfig

exports.defaultConfig = {
  keepachangelog: {
    changeVersion: false,
  },
  rules: {
    description: ['fail', { minLength: 20 }],
    assignee: 'off',
    reviewers: 'off',
    pr_size: [
      'warn',
      {
        additionLimit: 420,
        deletionLimit: -1,
      },
    ],
    lock_file: 'warn',
    no_ignored_test: [
      'fail',
      {
        filePattern: /test|spec/i,
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
}

exports.getConfig = () => currentConfig

exports.setConfig = (config) => {
  currentConfig = {
    ...exports.defaultConfig,
    ...(config || {}),
    rules: {
      ...exports.defaultConfig.rules,
      ...(config && config.rules),
    },
  }

  return currentConfig
}
