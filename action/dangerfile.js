// docs at https://github.com/vtex/danger
const { verify } = require('../lib')

verify({
  keepachangelog: {
    // set to 'true' to require a new version defined in the changelog change
    changeVersion: JSON.parse(process.env.REQUIRE_CHANGELOG_VERSION || 'false'),
  },
})
