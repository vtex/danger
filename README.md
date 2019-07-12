# `@vtex/danger`

Opinionated and configurable `danger.js` rules.

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=3 orderedList=false} -->

<!-- code_chunk_output -->

- [Usage](#usage)
- [Rules](#rules)
  - [`file_changes`](#file_changes)
  - [`changelog`](#changelog)
  - [`description`](#description)
  - [`wip`](#wip)
  - [`assignee`](#assignee)
  - [`reviewers`](#reviewers)
  - [`pr_size`](#pr_size)
  - [`lock_file`](#lock_file)
  - [`need_rebase`](#need_rebase)
  - [`dot_only`](#dot_only)
  - [`console_log`](#console_log)

<!-- /code_chunk_output -->

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

Rules are configured in a similar manner to `eslint` rules:

```js
{
  rules:  {
    example_rule: 'warn',
    other_rule: ['fail', { path: 'foo' }].
    some_rule: 'off',
    not_the_same_rule: 'message'
  }
}
```

**Log levels**

- `off` - disable the rule;
- `info` - rule result is a informational log;
- `warn` - rule result should be an alert;
- `fail` - rule result will block the pull request;

---

### `file_changes`

Display a list of all _created_, _modified_ and _deleted_ files.

**Options:**

```js
{
  // Should list created files
  created: true,
  // Should list deleted files
  deleted: true,
  // Should list modified files
  modified: true,
}
```

**Example:**

> 🎨 **Changed Files:**
> .prettierrc, package.json, yarn.lock
>
> ✨ **Created Files:**
> .foo/ci.yml, .foo/deployment.json
>
> 🔥 **Deleted Files:**
> .foo/cy.yml

---

### `changelog`

Enforce updates on the `CHANGELOG.md` file for every pull request.

**Options:**

```js
{
  // Path to the changelog file
  path: 'CHANGELOG.md',
},
```

**Example:**

> 📝 Please add a changelog entry for your changes.

---

### `description`

Enforce a minimum description length.

**Options:**

```js
{
  // Minimum description length
  minLength: 20,
},
```

**Example:**

> 📝 Please add a changelog entry for your changes.

---

### `wip`

Display a message alerting that the pull request is currently a work-in-progress. It looks for a `WIP` on the pull request title.

**Example:**

> 🚧 Pull request is currently a **Work In Progress**.

---

### `assignee`

Enforce having an assigned user to merge the pull request.

**Example:**

> 👤 Please assign someone to merge this PR, and optionally include people who should review.

---

### `reviewers`

Enforce having at least one person to review the pull request.

**Example:**

> 👥 There are no reviewers assigned to this pull request!

---

### `pr_size`

Enforce smaller pull requests by alerting if its size is relatively big. This rule considers `additions + deletions`.

**Options:**

```js
{
  // addition number limit
  additionLimit: 800,
  // deletion number limit. `-1` for no limit
  deletionLimit: -1,
},
```

**Example:**

> 👀 Pull Request size seems relatively large (>800 modifications). If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.

---

### `lock_file`

Enforce lock files are updated together with the `package.json` file.

**Example:**

> Changes were made to package.json, but not to yarn.lock - Perhaps you need to run yarn install?

---

### `need_rebase`

Display a message if the pull request branch needs a rebase with the `base` branch.

**Example:**

> Branch is not rebased with `master`.

---

### `dot_only`

Enforce no `it.only`, `describe.only`, `fdescribe`, `fit(` inside test files.

**Options:**

```js
{
  // files to search pattern
  pattern: /test|spec/i,
}
```

**Example:**

> 🚫 An `it.only` was left in this file `react/tests/utils.test.tsx#L18`

---

### `console_log`

Enforce no `it.only`, `describe.only`, `fdescribe`, `fit(` inside test files.

**Options:**

```js
{
  // files to search pattern
  pattern: /test|spec/i,
}
```

**Example:**

> ⚠️ A wild `console.log` has appeared on this file: `react/components/pages/Details.tsx#L21`. Is this supposed to be here?
