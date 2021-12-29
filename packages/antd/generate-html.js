const axios = require('axios')
const fs = require('fs')
const nps = require('path')

async function main() {
  const htmlRes = await axios.get('https://ant.design/components/overview-cn/')
  fs.writeFileSync(nps.join(__dirname, 'overview.html'), htmlRes.data)
}

main().catch(console.error)
