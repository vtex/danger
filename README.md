# `@vtex/danger`

This repo exposes two projects:

- `@vtex/danger`, a package with an opinionated and configurable danger ruleset;
- `vtex/danger`, a Github Action that automatically runs the default configuration of `@vtex/danger` in a given repository.

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=4 orderedList=false} -->

<!-- code_chunk_output -->

- [Usage as an action](#usage-as-an-action)
- [Usage as a package](#usage-as-a-package)
  - [Rules](#rules)
    - [`description`](#description)
    - [`assignee`](#assignee)
    - [`reviewers`](#reviewers)
    - [`pr_size`](#pr_size)
    - [`lock_file`](#lock_file)
    - [`no_ignored_test`](#no_ignored_test)
    - [`no_debugger`](#no_debugger)
    - [`enforce_graphql_provider`](#enforce_graphql_provider)

<!-- /code_chunk_output -->

## Usage as an action

`vtex/danger` automatically installs your dependencies and run `danger` for you. Your project doesn't even have to have a `dangerfile.js`!

To use it, it's as simple as adding it to one of your project workflows:

```yml
name: Some github action

on:
  pull_request:
    branches:
      - master

jobs:
  danger-ci:
    name: Danger CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: actions/setup-node@master
        with:
          node-version: 12.x
      - name: Danger CI
        uses: vtex/danger@master
        env:
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
          REQUIRE_CHANGELOG_VERSION: true
```

The `vtex/danger` action accepts the below options:

- `GITHUB_TOKEN` _(required)_ - A Github token for danger to use. You can you the `secrets.GITHUB_TOKEN` secret.
- `REQUIRE_CHANGELOG_VERSION` _(default: `false`)_ - Define if the changelog rule should look for a new release version entry in the updated changelog.

## Usage as a package

If you want to use the `@vtex/danger` ruleset separatedly from its action, you can install the package and call it in your `dangerfile.js`.

```shell
$ yarn add -D @vtex/danger
# or
$ npm i -D @vtex/danger
```

The next step is to create a `dangerfile.js` file. It's where `danger` expects your pull request checks to be.

Instead of having to write all kinds of checks over and over again, `@vtex/danger` exports a `verify` method which executes all of its checks:

```js
// dangerfile.js
const { verify } = require('@vtex/danger')

verify()
```

It also accepts a configuration object:

```js
// dangerfile.js
const { verify } = require('@vtex/danger')

const config = {
  // Set to true to enforce keepachangelog rules.
  keepachangelog: {
    changeVersion: false,
  },
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
    assignee: 'off',
    reviewers: 'off',
    pr_size: ['warn', { additionLimit: 800, deletionLimit: -1 }],
    lock_file: 'warn',
    no_ignored_test: ['fail', { pattern: /test|spec/i }],
    no_debugger: ['fail', { pattern: /\.[tj]sx?$/i }],
    enforce_graphql_provider: 'fail',
  },
}

verify(config)
```

### Changelog

`@vtex/danger` uses the [danger-plugin-keepachangelog](https://github.com/vtex/danger-plugin-keepachangelog/) to check for the validity of a pull request's changelog entry. Please refer to the plugin documentation for further explanations and options.
`The plugin can be configured by passing a`keepachangelog` property to the config object:

```js
{
  keepachangelog: {
    ...pluginOptions
  },
  ...
}
```

### Rules

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

#### `description`

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

#### `assignee`

Enforce having an assigned user to merge the pull request.

**Example:**

> 👤 Please assign someone to merge this PR, and optionally include people who should review.

---

#### `reviewers`

Enforce having at least one person to review the pull request.

**Example:**

> 👥 There are no reviewers assigned to this pull request!

---

#### `pr_size`

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

#### `lock_file`

Enforce lock files are updated together with the `package.json` file.

**Example:**

> Changes were made to package.json, but not to yarn.lock - Perhaps you need to run yarn install?

---

#### `no_ignored_test`

Enforce no `it.only`, `describe.only`, `fdescribe`, `fit(`, `xit(`, `it.skip`, `describe.skip` inside files which respect the specified filename pattern.

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

#### `no_debugger`

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

#### `enforce_graphql_provider`

Enforce `.gql` and `.graphql` files to explicitly declare the `@context(provider: "...")` for graphql queries.

**Example:**

> ⚠️ No `@context(provider: "...")` found on [updateName.gql](https://github.com/owner/repo/updateName.gql). Please explicitly declare the query provider.
