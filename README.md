# `@vtex/danger`

Opinionated and configurable `danger.js` rules.

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=3 orderedList=false} -->

<!-- code_chunk_output -->

- [Usage](#usage)
- [Rules](#rules)
  - [`description`](#description)
  - [`wip`](#wip)
  - [`assignee`](#assignee)
  - [`reviewers`](#reviewers)
  - [`pr_size`](#pr_size)
  - [`lock_file`](#lock_file)
  - [`no_dot_only`](#no_dot_only)
  - [`no_console_log`](#no_console_log)
  - [`no_debugger`](#no_debugger)
  - [`enforce_graphql_provider`](#enforce_graphql_provider)

<!-- /code_chunk_output -->

## Usage

Begin by installing the package:

```shell
$ yarn add -D @vtex/danger
# or
$ npm i -D @vtex/danger
```

The next step is to create a `dangerfile.js` file. It's where `danger` expects your pull request checks to be.

Instead of having to write all kinds of checks over and over again, `@vtex/danger` exports a `assert` method which executes all of its checks:

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
      'off',
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
    pr_size: ['warn', { additionLimit: 800, deletionLimit: -1 }],
    lock_file: 'warn',
    no_dot_only: ['fail', { pattern: /test|spec/i }],
    no_console_log: ['warn', { pattern: /\.[tj]sx?$/i }],
    no_debugger: ['fail', { pattern: /\.[tj]sx?$/i }],
    enforce_graphql_provider: 'fail',
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

### `no_dot_only`

Enforce no `it.only`, `describe.only`, `fdescribe`, `fit(` inside files which respect the specified filename pattern.

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

### `no_console_log`

Enforce no `console.log` inside files which respect the specified filename pattern.

**Options:**

```js
{
  // files to search pattern
  pattern: /\.[tj]sx?$/i,
}
```

**Example:**

> ⚠️ A wild `console.log` has appeared on `react/components/pages/Details.tsx#L21`. Is this supposed to be here?

### `no_debugger`

Enforce no `debugger` inside files which respect the specified filename pattern.

**Options:**

```js
{
  // files to search pattern
  pattern: /\.[tj]sx?$/i,
}
```

**Example:**

> ⚠️ Is this a `debugger` that I see on [withQuery.tsx#L52](https://github.com/owner/repo/blob/src/withQuery.tsx#L52)?

### `enforce_graphql_provider`

Enforce `.gql` and `.graphql` files to explicitly declare the `@context(provider: "...")` for graphql queries.

**Example:**

> ⚠️ No `@context(provider: "...")` found on [updateName.gql](https://github.com/owner/repo/updateName.gql). Please explicitly declare the query provider.
