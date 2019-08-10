const request = require('request-promise')

const parser = new DOMParser()

class Language {
  constructor(text) {
    this.text = text
  }

  toString() {
    return `(${this.text})`
  }
}

const getLanguages = () => new Promise((resolve, reject) => {
  request('https://github.com/trending')
    .then(response => {
      if (!response) {
        reject('response is null!')
        return
      }
      const docHtml = parser.parseFromString(response, 'text/html')
      const nodes = docHtml
        .querySelector('.select-menu-list')
        .querySelectorAll('.select-menu-item-text')
      const languages = nodes.map(node => Language(node.innerHTML)).toArray()
      resolve(languages)
    })
    .catch(error => {
      reject(error)
    })
})


export default getLanguages
