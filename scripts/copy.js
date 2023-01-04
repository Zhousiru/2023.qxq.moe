const fs = require('fs-extra')

console.log('⚡ Copy files...')

fs.removeSync(`dist/`)
const copy = (path) => {
    return fs.copySync(path, `dist/${path}`)
}

copy('index.html')
copy('en/')
copy('assets/')

console.log('👌 All done!')
