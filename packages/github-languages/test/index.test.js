const { getLanguages } = require('../src/index')

describe('get languages', () => {
  let languages
  beforeAll(async () => {
    languages = await getLanguages()
  })

  test('has data', () => {
    expect(languages).not.toHaveLength(0)
  })
})
