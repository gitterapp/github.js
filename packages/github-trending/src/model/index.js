// trending repositories model
class TrendingRepository {
  constructor({
    owner,
    avatar,
    name,
    description,
    descriptionHTML,
    starCount,
    forkCount,
    stars,
    primaryLanguage,
    buildBys,
  }) {
    this.owner = owner
    this.avatar = avatar
    this.name = name
    this.description = description
    this.descriptionHTML = descriptionHTML
    this.starCount = starCount
    this.forkCount = forkCount
    this.stars = stars
    this.primaryLanguage = primaryLanguage
    this.buildBys = buildBys
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(json) {
    return JSON.parse(json)
  }
}

class PrimaryLanguage {
  constructor({ name, color }) {
    this.name = name
    this.color = color
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(json) {
    return JSON.parse(json)
  }
}

class RepositoryBuildBy {
  constructor({ avatar, username }) {
    this.avatar = avatar
    this.username = username
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(json) {
    return JSON.parse(json)
  }
}

// trending developers model
class TrendingDeveloper {
  constructor({ avatar, username, nickname, popularRepository }) {
    this.avatar = avatar
    this.username = username
    this.nickname = nickname
    this.popularRepository = popularRepository
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(json) {
    return JSON.parse(json)
  }
}

// popular repository model
class PopularRepository {
  constructor({ url, name, description, descriptionRawHtml }) {
    this.url = url
    this.name = name
    this.description = description
    this.descriptionRawHtml = descriptionRawHtml
  }

  toJson() {
    return JSON.stringify(this)
  }

  static fromJson(json) {
    return JSON.parse(json)
  }
}

module.exports = {
  TrendingRepository,
  PrimaryLanguage,
  RepositoryBuildBy,
  TrendingDeveloper,
  PopularRepository,
}
