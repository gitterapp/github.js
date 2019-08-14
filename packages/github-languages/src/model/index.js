class Language {
  constructor(text) {
    this.text = text
  }

  toString() {
    return `(${this.text})`
  }
}

module.exports = Language
