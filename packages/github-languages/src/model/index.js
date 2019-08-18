class Language {
  constructor(text, color) {
    this.text = text
    this.color = color
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(json) {
    return JSON.parse(json)
  }
}

module.exports = Language
