/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

exports.default = async function (context) {
  const productFilename = context.packager?.appInfo?.productFilename || 'highwin-next'
  const localeDirs = [
    path.join(context.appOutDir, 'locales'),
    path.join(
      context.appOutDir,
      `${productFilename}.app`,
      'Contents',
      'Frameworks',
      'Electron Framework.framework',
      'Resources'
    )
  ]

  const localeDir = localeDirs.find((dir) => fs.existsSync(dir))
  if (!localeDir) return

  const files = fs.readdirSync(localeDir)
  files.forEach((file) => {
    if (file.endsWith('.pak') && !['zh-CN.pak', 'en-US.pak'].includes(file)) {
      fs.unlinkSync(path.join(localeDir, file)) // 删除不需要的语言文件
    }
  })
}
