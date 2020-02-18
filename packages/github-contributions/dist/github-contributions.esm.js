/*!
 * @githubjs/github-contributions v1.1.5
 * (c) 2014-2020 Ying Wang <upcwangying@gmail.com> (https://github.com/upcwangying)
 * Released under the MIT License.
 */
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

var Contribution = require('./model/index.js');

var options = {
  uri: 'https://github.com/trending',
  transform: function transform(body) {
    return cheerio.load(body);
  }
};

var getContributions = function getContributions(login) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      from = _ref.from,
      to = _ref.to;

  return new Promise(function (resolve, reject) {
    if (!login) throw new Error('login must not be null');
    var uri = "https://github.com/".concat(login);

    if (from != null && to != null) {
      uri += "?from=".concat(from, "&to=").concat(to);
    }

    rp(_objectSpread2({}, options, {
      uri: uri
    })).then(function ($) {
      if (!$) {
        reject('response is null!');
        return;
      }

      var contributions = [];
      $('.js-calendar-graph-svg rect').each(function (i, el) {
        contributions.push(new Contribution({
          color: $(el).attr('fill'),
          count: parseInt($(el).attr('data-count'), 10),
          date: $(el).attr('data-date')
        }));
      });
      resolve(contributions);
    })["catch"](function (error) {
      reject(error);
    });
  });
};

var getContributionsSvg = function getContributionsSvg(login, _ref2) {
  var _ref2$keepDateText = _ref2.keepDateText,
      from = _ref2.from,
      to = _ref2.to;
  return new Promise(function (resolve, reject) {
    if (!login) throw new Error('login must not be null');
    var uri = "https://github.com/".concat(login);

    if (from != null && to != null) {
      uri += "?from=".concat(from, "&to=").concat(to);
    }

    rp(_objectSpread2({}, options, {
      uri: uri
    })).then(function ($) {
      if (!$) {
        reject('response is null!');
        return;
      }

      var svgNode = $('.js-calendar-graph-svg');

      resolve(svgNode.html());
    })["catch"](function (error) {
      reject(error);
    });
  });
};

module.exports = {
  Contribution: Contribution,
  getContributions: getContributions,
  getContributionsSvg: getContributionsSvg
};
