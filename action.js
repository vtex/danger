const { existsSync } = require('fs')
const { resolve } = require('path')

const { Toolkit } = require('actions-toolkit')

// Run your GitHub Action!
Toolkit.run(
  async tools => {
    const dangerfilePath = resolve(tools.workspace, 'dangerfile.js')
    if (!existsSync(dangerfilePath)) {
      tools.log.warn(
        `No "dangerfile.js" found in the root directory. Skipping.`
      )
      return
    }

    try {
      await tools.runInWorkspace('yarn', ['danger', 'ci'])
    } catch (e) {
      tools.exit.failure(e)
      return
    }

    tools.exit.success()
  },
  {
    secrets: ['GITHUB_TOKEN'],
  }
)
