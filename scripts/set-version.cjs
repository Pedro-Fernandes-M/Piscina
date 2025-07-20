const { execSync } = require('child_process')
const fs = require('fs')

const commitCount = execSync('git rev-list --count HEAD').toString().trim()
const version = commitCount > 50 ? `0.1.${commitCount}` : `0.0.${commitCount}`

fs.writeFileSync('.env', `VITE_APP_VERSION=${version}\n`)
