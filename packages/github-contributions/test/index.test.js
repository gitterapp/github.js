const { getContributions } = require('../src/index')

describe('get contributions', () => {
  let contributions
  beforeAll(async () => {
    contributions = await getContributions('upcwangying', {})
  }, 20000)

  test('has data', () => {
    expect(contributions).not.toBeUndefined()
  }, 30000)
})
