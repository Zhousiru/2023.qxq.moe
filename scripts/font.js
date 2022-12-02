const subsetFont = require('subset-font')
const fs = require('fs-extra')
const cheerio = require('cheerio')
const process = require('process')
const path = require('path')

console.log("⚡ Start to generate fonts...")

/*
 * copy files
 */
console.log("   Copy files...")

fs.removeSync(`dist/`)
const copy = (path) => {
    return fs.copySync(path, `dist/${path}`)
}

try {

    copy("index.html")
    copy("en/")
    copy("assets/")

} catch (err) {
    console.error(err)
    process.exit()
}

/*
 * edit css
 */
console.log("   Edit CSS...")
const template = `
@font-face {
    font-family: "Noto Sans SC";
    font-display: swap;
    src: url(../font/NotoSansSC-Regular.woff2) format("woff2");
}

@font-face {
    font-family: "Noto Serif SC";
    font-display: swap;
    src: url(../font/NotoSerifSC-Regular.woff2) format("woff2");
}
`
fs.writeFileSync('dist/assets/css/font.css', template)

/*
 * get text from pages
 */
console.log("   Override text...")
const getText = (paths, selectors) => {
    let text = ''

    for (const p of paths) {
        const page = fs.readFileSync('dist/' + p).toString()
        const $ = cheerio.load(page)

        for (const s of selectors) {
            text += $(s).text().replace(/\s/g, '')
        }
    }

    return text
}

let fontMap = {
    "NotoSansSC-Regular.otf": "",
    "NotoSerifSC-Regular.otf": ""
}

fontMap['NotoSansSC-Regular.otf'] = getText([
    './index.html',
    './en/index.html'
], [
    '#toggle-lang',
    '.tag'
])

fontMap['NotoSerifSC-Regular.otf'] = getText([
    './index.html',
    './en/index.html'
], [
    '#greet',
    '#more-card'
])

/*
 * gen fonts
 */
console.log("   Generate fonts...")
const genFont = async (fontFilename, text) => {
    const fullpath = `dist/assets/font/${fontFilename}`

    const fontBuf = Buffer.from(fs.readFileSync(fullpath))

    const subsetBuf = await subsetFont(fontBuf, text, {
        targetFormat: 'woff2',
    })

    fs.writeFileSync(`dist/assets/font/${path.parse(fontFilename).name}.woff2`, subsetBuf)
    fs.removeSync(fullpath)
}

let p = []

for (const [k, v] of Object.entries(fontMap)) {
    p.push(genFont(k, v))
}

Promise.all(p).then(() => {
    console.log("👌 All done!")
    process.exit()
})
