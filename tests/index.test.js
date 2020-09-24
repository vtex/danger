const { resolve } = require('path')

const { Toolkit } = require('actions-toolkit')

let action
let tools

// Mock Toolkit.run to define `action` so we can call it
jest.spyOn(Toolkit, 'run').mockImplementation((actionFn) => {
  action = actionFn
})
// Load up our entrypoint file
require('../lib')

function mockTools(cwd) {
  process.env.GITHUB_WORKSPACE = cwd

  // Create a new Toolkit instance
  tools = new Toolkit()

  // Mock methods on it!
  jest.spyOn(tools.exit, 'success').mockImplementation()
  jest.spyOn(tools.exit, 'failure').mockImplementation()
  jest.spyOn(tools.log, 'warn').mockImplementation()
}

// eslint-disable-next-line jest/no-disabled-tests
describe('success', () => {
  mockTools(resolve(__dirname, 'fixtures', 'correct'))

  it('exits successfully', async () => {
    await action(tools)
    expect(tools.exit.success).toHaveBeenCalled()
  })
})
