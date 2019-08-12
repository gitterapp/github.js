const getLanguages = require('../src/index')

getLanguages().then(result => {
  console.log(result.length)
  result.forEach(language => {
    console.log(language)
  })
}).catch(error => {
  console.error(error)
})
