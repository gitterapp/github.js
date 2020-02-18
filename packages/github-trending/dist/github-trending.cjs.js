/*!
 * @githubjs/github-trending v1.1.6
 * (c) 2014-2020 Ying Wang <upcwangying@gmail.com> (https://github.com/upcwangying)
 * Released under the MIT License.
 */
'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var rp = require('request-promise');

var cheerio = require('cheerio');

var TrendingSince = require('./constant/trending-since');

var TrendingType = require('./constant/trending-type');

var _require = require('./model/index.js'),
    TrendingRepository = _require.TrendingRepository,
    PrimaryLanguage = _require.PrimaryLanguage,
    RepositoryBuildBy = _require.RepositoryBuildBy,
    TrendingDeveloper = _require.TrendingDeveloper,
    PopularRepository = _require.PopularRepository;

var URL = 'https://github.com';
var options = {
  uri: "".concat(URL, "/trending"),
  transform: function transform(body) {
    return cheerio.load(body);
  }
};

var getTrendingRepositories = function getTrendingRepositories() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      since = _ref.since,
      language = _ref.language;

  return new Promise(function (resolve, reject) {
    var uri = "".concat(URL, "/trending");

    if (language) {
      uri += "/".concat(language);
    }

    if (since) {
      uri += "?since=".concat(since);
    }

    rp(_objectSpread2({}, options, {
      uri: uri
    })).then(function ($) {
      if (!$) {
        reject('response is null!');
        return;
      }

      var repositories = [];
      $('.Box-row').each(function (i, el) {
        var colorNode = $('.repo-language-color', el);
        var primaryLanguage;

        if (colorNode != null) {
          var regResult = new RegExp('#[0-9a-fA-F]{3,6}').exec($(colorNode).attr('style'));
          var child = $(colorNode).next();
          var nameResult = child == null || child.html() == null ? null : child.html();
          primaryLanguage = new PrimaryLanguage({
            name: nameResult == null ? null : nameResult.trim(),
            color: regResult == null ? null : regResult[0]
          });
        }

        var starNode = $('.f6 .muted-link .octicon-star', el);
        var starCountStr;

        if (starNode != null) {
          starCountStr = $(starNode).parent().html().replace(/^[\s\S]*svg>/g, '').replace(/,/g, '');
        }

        var starCount = starCountStr == null ? null : parseInt(starCountStr.trim(), 10);
        var forkNode = $('.f6 .octicon-repo-forked', el);
        var forkCountStr;

        if (forkNode != null) {
          forkCountStr = $(forkNode).parent().html().replace(/^[\s\S]*svg>/g, '').replace(/,/g, '');
        }

        var forkCount = forkCountStr == null ? null : parseInt(forkCountStr.trim(), 10);
        var starsNode = $('.float-sm-right', el);
        var starsStr;

        if (starsNode != null) {
          starsStr = $(starsNode).html().replace(/^[\s\S]*svg>/g, '').replace(/,/g, '').trim();
        }

        var description;
        var descriptionHTML;
        var pDesc = $('p', el);
        var descriptionRawHtml = pDesc == null ? null : pDesc.html();
        descriptionRawHtml = descriptionRawHtml == null ? null : descriptionRawHtml.trim();

        if (descriptionRawHtml != null) {
          description = descriptionRawHtml.replace(/<g-emoji.*?>/g, '').replace(/<\/g-emoji>/g, '').replace(/<a.*?>/g, '').replace(/<\/a>/g, '').trim();
          descriptionHTML = "<div>".concat(descriptionRawHtml, "</div>");
        }

        var buildBys = [];
        var avatarNodes = $('.avatar', el);

        if (avatarNodes != null && avatarNodes.length > 0) {
          avatarNodes.each(function (index, e) {
            buildBys.push(new RepositoryBuildBy({
              avatar: $(e).attr('src'),
              username: $(e).attr('alt').replace(/@/g, '')
            }));
          });
        }

        var usernameNode = $('.text-normal', el);
        var username;

        if (usernameNode) {
          username = usernameNode.html().replace('/', '').trim();
        }

        var repoNode = $('.text-normal', el);
        var reponame;

        if (repoNode) {
          reponame = repoNode.parent().html().replace(/[\s\S]*span>/g, '').trim();
        }

        repositories.push(new TrendingRepository({
          owner: username,
          avatar: "".concat(URL, "/").concat(username, ".png"),
          name: reponame,
          description: description,
          descriptionHTML: descriptionHTML,
          starCount: starCount,
          forkCount: forkCount,
          stars: starsStr,
          primaryLanguage: primaryLanguage,
          buildBys: buildBys
        }));
      });
      resolve(repositories);
    })["catch"](function (error) {
      reject(error);
    });
  });
};

var getTrendingDevelopers = function getTrendingDevelopers() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      since = _ref2.since,
      language = _ref2.language;

  return new Promise(function (resolve, reject) {
    var uri = "".concat(URL, "/trending/developers");

    if (language) {
      uri += "/".concat(language);
    }

    if (since) {
      uri += "?since=".concat(since);
    }

    rp(_objectSpread2({}, options, {
      uri: uri
    })).then(function ($) {
      if (!$) {
        reject('response is null!');
        return;
      }

      var developers = [];
      $('.Box-row').each(function (i, el) {
        var popularRepository;
        var popularParentNode = $('.d-sm-flex .col-md-6', el);
        var popularNode = popularParentNode == null ? null : popularParentNode.last();

        if (popularNode != null) {
          var description;
          var descriptionHTML;
          var descriptionParentNode = $('.mt-1', popularNode);
          var descriptionRawHtml = descriptionParentNode == null ? null : descriptionParentNode.html();
          descriptionRawHtml = descriptionRawHtml == null ? null : descriptionRawHtml.trim();

          if (descriptionRawHtml != null) {
            description = descriptionRawHtml.replace(/<g-emoji.*?>/g, '').replace(/<\/g-emoji>/g, '').replace(/<a.*?>/g, '').replace(/<\/a>/g, '').trim();
            descriptionHTML = "<div>".concat(descriptionRawHtml, "</div>");
          }

          var aNode = $('div>article>h1>a', popularNode);
          var url = aNode == null ? null : $(aNode).attr('href');
          var name;

          if (aNode) {
            name = $(aNode).text().trim();
          }

          popularRepository = new PopularRepository({
            url: url,
            name: name,
            description: description,
            descriptionRawHtml: descriptionHTML
          });
        }

        var avatarNode = $('.rounded-1', el);
        var usernameNode = $('.link-gray', el);
        var nicknameNode = $('.d-md-flex', el);
        var avatar;

        if (avatarNode) {
          avatar = $(avatarNode).attr('src').trim();
        }

        var username;

        if (usernameNode) {
          username = $(usernameNode).html().trim();
        }

        var nickname;

        if (nicknameNode) {
          nickname = $('.lh-condensed', nicknameNode).children().first().text().trim();
        }

        developers.push(new TrendingDeveloper({
          avatar: avatar,
          username: username,
          nickname: nickname,
          popularRepository: popularRepository
        }));
      });
      resolve(developers);
    })["catch"](function (error) {
      reject(error);
    });
  });
};

module.exports = {
  TrendingRepository: TrendingRepository,
  PrimaryLanguage: PrimaryLanguage,
  RepositoryBuildBy: RepositoryBuildBy,
  TrendingDeveloper: TrendingDeveloper,
  PopularRepository: PopularRepository,
  TrendingSince: TrendingSince,
  TrendingType: TrendingType,
  getTrendingRepositories: getTrendingRepositories,
  getTrendingDevelopers: getTrendingDevelopers
};
