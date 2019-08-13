// Contribution model
class Contribution {
  constructor({ count, color, date }) {
    this.count = count
    this.color = color
    this.date = date
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(json) {
    return JSON.parse(json)
  }
}

module.exports = Contribution
