const getLanguages = require('../src/index')

describe('get languages', () => {
  let languages
  beforeAll(async () => {
    languages = await getLanguages()
  }, 10000)

  test('has data', () => {
    console.log(languages)
    expect(languages).not.toHaveLength(0)
  }, 15000)
})
