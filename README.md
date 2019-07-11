# `@vtex/danger`

> This README is WIP

## Usage

`@vtex/danger` exports a `assert` method which executes all configured checks:

```js
// dangerfile.js
const { assert } = require('@vtex/danger');

assert();
```

It also accepts a configuration object:

```js
// dangerfile.js
const { assert } = require('@vtex/danger');

assert({
  matchers: {
    test_files: path => path.match(/test|spec/i),
    code_files: path => path.match(/\.[tj]sx?$/i),
  },
  rules: {
    file_changes: [
      'info',
      {
        created: true,
        deleted: true,
        modified: true,
      },
    ],
    changelog: 'fail',
    description: ['fail', { minLength: 20 }],
    wip: 'fail',
    assignee: 'fail',
    reviewers: 'fail',
    pr_size: [
      'warn',
      {
        additionLimit: 800,
        deletionLimit: -1,
      },
    ],
    lock_file: 'warn',
    need_rebase: 'warn',
    dot_only: 'fail',
    console_log: 'warn',
  },
});
```
