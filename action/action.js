const { resolve } = require('path')
const { existsSync } = require('fs')

const { Toolkit } = require('actions-toolkit')

const resolveFromActionRoot = (...paths) => resolve(__dirname, '..', ...paths)

// Run your GitHub Action!
Toolkit.run(
  async (tools) => {
    try {
      const localDangerfilePath = resolve(tools.workspace, 'dangerfile.js')

      await tools.exec(
        resolveFromActionRoot('node_modules', '.bin', 'danger'),
        [
          'ci',
          '-d',
          existsSync(localDangerfilePath)
            ? // if the project has a dangerfile, let's use it
              localDangerfilePath
            : // if not, use our default one
              resolveFromActionRoot('action', 'dangerfile.js'),
        ]
      )
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
