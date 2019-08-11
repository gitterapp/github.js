const rp = require('request-promise')
const cheerio = require('cheerio')
const Language = require('./model/language.js')

const options = {
  uri: 'https://github.com/trending',
  transform: (body) => cheerio.load(body),
};

const getLanguages = () => new Promise((resolve, reject) => {
  rp(options)
    .then($ => {
      if (!$) {
        reject('response is null!')
        return
      }
      const languages = [];
      $('.select-menu-list > div .select-menu-item-text').each((i, el) => {
        languages.push(new Language($(el).text()))
      })
      resolve(languages)
    })
    .catch(error => {
      reject(error)
    })
})

module.exports = getLanguages
