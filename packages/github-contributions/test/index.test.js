const getContributions = require('../src/index')

getContributions({ login: 'upcwangying' }).then(result => {
  console.log(result)
}).catch(error => {
  console.error(error)
})
