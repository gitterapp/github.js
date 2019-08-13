const {
  getTrendingRepositories,
  getTrendingDevelopers,
} = require('../src/index')

describe('get trending repositories', () => {
  let repositories
  beforeAll(async () => {
    repositories = await getTrendingRepositories({})
  })

  test('has data', () => {
    expect(repositories).not.toBeNull()
  })
})

describe('get trending developers', () => {
  let developers
  beforeAll(async () => {
    developers = await getTrendingDevelopers({})
  })

  test('has data', () => {
    expect(developers).not.toBeNull()
  })
})
