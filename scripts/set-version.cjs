const { execSync } = require('child_process')
const fs = require('fs')

const commitCount = execSync('git rev-list --count HEAD').toString().trim()

commitCount.toString().split('').join('.')

const version =
  commitCount > 100
    ? commitCount.toString().split('').join('.')
    : '0.' + commitCount.toString().split('').join('.')

fs.writeFileSync('.env', `VITE_APP_VERSION=V ${version}\n`)
