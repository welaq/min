/* compile the language files into dist/localization.build.js */

const path = require('path')
const fs = require('fs')
const decomment = require('decomment')

const outputDir = path.join(__dirname, '../dist')
const outputFile = path.join(outputDir, 'localization.build.js')

const languageFileDir = path.join(__dirname, '../localization/languages')

function buildLocalization () {
  // read all the files from the "languages" directory

  const languageFiles = fs.readdirSync(languageFileDir)

  // build languages object

  let languages = {}

  languageFiles.forEach(function (file) {
    let data = fs.readFileSync(path.join(languageFileDir, file), 'utf-8')

    let obj = JSON.parse(decomment(data))

    languages[obj.identifier] = obj
  })

  let fileContents = 'var languages = ' + JSON.stringify(languages) + ';\n'

  // add contents of localization.js (helper functions, ...)

  fileContents += fs.readFileSync(path.join(__dirname, '../localization/localizationHelpers.js'))

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  fs.writeFileSync(outputFile, fileContents)
}

if (module.parent) {
  module.exports = buildLocalization
} else {
  buildLocalization()
}
