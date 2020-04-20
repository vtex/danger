const { resolve } = require('path')

const { Toolkit } = require('actions-toolkit')

const resolveFromActionRoot = (...paths) => resolve(__dirname, '..', ...paths)

// Run your GitHub Action!
Toolkit.run(
  async tools => {
    try {
      await tools.runInWorkspace(
        resolveFromActionRoot('node_modules', '.bin', 'danger'),
        ['ci', '-d', resolveFromActionRoot('action', 'dangerfile.js')]
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
