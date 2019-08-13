const { getContributions } = require('../src/index')

describe('get contributions', () => {
  let contributions
  beforeAll(async () => {
    contributions = await getContributions('upcwangying', {})
  })

  test('has data', () => {
    expect(contributions).not.toBeNull()
  })
})
