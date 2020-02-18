/*!
 * @githubjs/github-contributions v1.1.5
 * (c) 2014-2020 Ying Wang <upcwangying@gmail.com> (https://github.com/upcwangying)
 * Released under the MIT License.
 */
'use strict';

const rp = require('request-promise');
const cheerio = require('cheerio');
const Contribution = require('./model/index.js');

const options = {
  uri: 'https://github.com/trending',
  transform: body => cheerio.load(body),
};

const getContributions = (login, { from, to } = {}) =>
  new Promise((resolve, reject) => {
    if (!login) throw new Error('login must not be null')
    let uri = `https://github.com/${login}`;
    if (from != null && to != null) {
      uri += `?from=${from}&to=${to}`;
    }
    rp({ ...options, uri })
      .then($ => {
        if (!$) {
          reject('response is null!');
          return
        }
        const contributions = [];
        $('.js-calendar-graph-svg rect').each((i, el) => {
          contributions.push(
            new Contribution({
              color: $(el).attr('fill'),
              count: parseInt($(el).attr('data-count'), 10),
              date: $(el).attr('data-date'),
            }),
          );
        });
        resolve(contributions);
      })
      .catch(error => {
        reject(error);
      });
  });

const getContributionsSvg = (login, { keepDateText = false, from, to }) =>
  new Promise((resolve, reject) => {
    if (!login) throw new Error('login must not be null')
    let uri = `https://github.com/${login}`;
    if (from != null && to != null) {
      uri += `?from=${from}&to=${to}`;
    }
    rp({ ...options, uri })
      .then($ => {
        if (!$) {
          reject('response is null!');
          return
        }
        const svgNode = $('.js-calendar-graph-svg');

        resolve(svgNode.html());
      })
      .catch(error => {
        reject(error);
      });
  });

module.exports = {
  Contribution,

  getContributions,
  getContributionsSvg,
};
