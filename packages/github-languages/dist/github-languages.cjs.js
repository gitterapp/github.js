/*!
 * @githubjs/github-languages v1.1.5
 * (c) 2014-2020 Ying Wang <upcwangying@gmail.com> (https://github.com/upcwangying)
 * Released under the MIT License.
 */
'use strict';

var rp = require('request-promise');

var jsyaml = require('js-yaml');

var Language = require('./model/index.js');

var options = {
  uri: 'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
};

var getLanguages = function getLanguages() {
  return new Promise(function (resolve, reject) {
    rp(options).then(function (response) {
      if (!response) {
        reject('response is null!');
        return;
      }

      var languages = [];
      var resultLanguages = jsyaml.safeLoad(response);

      for (var language in resultLanguages) {
        var resultLanguage = resultLanguages[language];
        languages.push(new Language(language, resultLanguage.color || '#cccccc'));
      }

      resolve(languages);
    })["catch"](function (error) {
      reject(error);
    });
  });
};

module.exports = {
  Language: Language,
  getLanguages: getLanguages
};
