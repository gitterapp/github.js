/*!
 * @githubjs/github-languages v1.1.5
 * (c) 2014-2020 Ying Wang <upcwangying@gmail.com> (https://github.com/upcwangying)
 * Released under the MIT License.
 */
const rp = require('request-promise');
const jsyaml = require('js-yaml');
const Language = require('./model/index.js');

const options = {
  uri: 'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml',
};

const getLanguages = () =>
  new Promise((resolve, reject) => {
    rp(options)
      .then(response => {
        if (!response) {
          reject('response is null!');
          return
        }
        const languages = [];
        const resultLanguages = jsyaml.safeLoad(response);
        for (const language in resultLanguages) {
          const resultLanguage = resultLanguages[language];
          languages.push(new Language(language, resultLanguage.color || '#cccccc'));
        }
        resolve(languages);
      })
      .catch(error => {
        reject(error);
      });
  });

module.exports = {
  Language,

  getLanguages,
};
