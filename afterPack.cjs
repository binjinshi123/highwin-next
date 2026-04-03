/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

exports.default = async function (context) {
  const localeDir = path.join(context.appOutDir, 'locales')

  fs.readdir(localeDir, (err, files) => {
    if (err) {
      console.error('读取 locales 目录出错：', err)
      return
    }

    files.forEach((file) => {
      if (!['zh-CN.pak', 'en-US.pak'].includes(file)) {
        fs.unlinkSync(path.join(localeDir, file)) // 删除不需要的语言文件
      }
    })
  })
}
