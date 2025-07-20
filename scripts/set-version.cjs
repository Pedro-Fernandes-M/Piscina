const { execSync } = require('child_process')
const fs = require('fs')

const commitCount = execSync('git rev-list --count HEAD').toString().trim()

const version = `v1.0.${commitCount}`
fs.writeFileSync('.env.version', `VITE_APP_VERSION=${version}`)
