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

const config = {
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

assert(config);
```

## Rules

### `file_changes`

### `changelog`

### `description`

### `wip`

### `assignee`

### `reviewers`

### `pr_size`

### `lock_file`

### `need_rebase`

### `dot_only`

### `console_log`
