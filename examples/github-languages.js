const { getTrendingDevelopers, getTrendingRepositories } = require('@githubjs/github-trending')

getTrendingDevelopers()
  .then(function(result) {
    console.log(result)
  })
  .catch(function(error) {
    console.error(error)
  })
