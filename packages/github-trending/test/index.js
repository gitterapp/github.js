const { getTrendingRepositories, getTrendingDevelopers } = require('../src/index')

getTrendingRepositories().then(result => {
  console.log(result)
}).catch(error => {
  console.error(error)
})

getTrendingDevelopers().then(result => {
  console.log(result)
}).catch(error => {
  console.error(error)
})
