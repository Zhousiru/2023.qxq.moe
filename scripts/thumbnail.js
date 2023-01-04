const { default: axios } = require('axios')
const fs = require('fs')
const sharp = require('sharp')

const AVATAR_URL =
    'https://uni-storage-1253266055.cos.ap-guangzhou.myqcloud.com/qavatar.webp'

async function genThumbnail() {
    console.log('⚡ Start to generate thumbnail...')

    const resp = await axios.get(AVATAR_URL, {
        responseType: 'arraybuffer',
    })

    const imgBase64 =
        'data:image/webp;base64,' +
        (await sharp(resp.data).resize({ width: 10 }).toBuffer()).toString(
            'base64'
        )

    for (const path of ['dist/index.html', 'dist/en/index.html']) {
        let page = fs.readFileSync(path).toString()
        page = page.replace('{{THUMBNAIL}}', imgBase64)
        fs.writeFileSync(path, page)
    }

    console.log('👌 All done!')
}

genThumbnail()
