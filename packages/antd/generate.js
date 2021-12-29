const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const nps = require('path')
const { asset, material, group } = require('@mometa/materials-generator')

async function main() {
  const htmlText = fs.readFileSync(nps.join(__dirname, 'overview.html'), 'utf-8')
  const $ = cheerio.load(htmlText)

  const groups = []
  const mat = material('Antd', 'Antd', groups)

  $('.components-overview').each((i, e) => {
    const groupTitle = $(e).find('.components-overview-group-title .ant-space-item:first-child').text()
    const assets = []
    groups.push(group(groupTitle, groupTitle, assets))

    $(e)
      .find('.ant-col > a[href]')
      .each((j, a) => {
        const homepage = $(a).attr('href')
        const [key, name] = $(a)
          .find('.components-overview-title')
          .get(0)
          .childNodes.filter((x) => x.type === 'text' && !!x.data.trim())
          .map((x) => x.data)
        const src = $(a).find('.components-overview-img img').attr('src')
        assets.push({
          name,
          key,
          homepage: `https://ant.design${homepage}`,
          cover: src,
          data: {
            code: `<$${key}$ />`,
            dependencies: {
              [key]: {
                source: 'antd',
                mode: 'named',
                imported: key
              }
            }
          }
        })
      })
  })

  console.log(mat)

  fs.writeFileSync(nps.join(__dirname, 'antd.json'), JSON.stringify(mat, null, 2))

  return mat
}

main().catch(console.error)
