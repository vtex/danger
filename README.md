# `@vtex/dangerutils`

## Usage

```js
// Dangerfile
const { rules, collections, utils } = require('@vtex/dangerutils')

checks.showFileChanges()
checks.checkChangelog()
checks.checkDescription()
checks.checkWIP()
checks.checkAssigneeAndReviewers()
checks.checkPRSize(additionDeletionLimit: int = 800)
checks.checkTestFiles()
checks.checkLockFileUpdated()
checks.checkConsoleLog()
checks.checkMergeability()
```
