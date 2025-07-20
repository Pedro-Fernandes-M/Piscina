const { execSync } = require('child_process')
const fs = require('fs')

const commitCount = execSync('git rev-list --count HEAD').toString().trim()
const version = `0.0.${commitCount}`

fs.writeFileSync('.env', `VITE_APP_VERSION=${version}\n`, { flag: 'a' }) // adiciona ao .env
console.log(`Versão gerada: ${version}`)
