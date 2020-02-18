/*!
 * @githubjs/github-trending v1.1.6
 * (c) 2014-2020 Ying Wang <upcwangying@gmail.com> (https://github.com/upcwangying)
 * Released under the MIT License.
 */
'use strict';

const rp = require('request-promise');
const cheerio = require('cheerio');
const TrendingSince = require('./constant/trending-since');
const TrendingType = require('./constant/trending-type');
const {
  TrendingRepository,
  PrimaryLanguage,
  RepositoryBuildBy,
  TrendingDeveloper,
  PopularRepository,
} = require('./model/index.js');

const URL = 'https://github.com';

const options = {
  uri: `${URL}/trending`,
  transform: body => cheerio.load(body),
};

const getTrendingRepositories = ({ since, language } = {}) =>
  new Promise((resolve, reject) => {
    let uri = `${URL}/trending`;
    if (language) {
      uri += `/${language}`;
    }
    if (since) {
      uri += `?since=${since}`;
    }
    rp({ ...options, uri })
      .then($ => {
        if (!$) {
          reject('response is null!');
          return
        }
        const repositories = [];
        $('.Box-row').each((i, el) => {
          const colorNode = $('.repo-language-color', el);
          let primaryLanguage;
          if (colorNode != null) {
            const regResult = new RegExp('#[0-9a-fA-F]{3,6}').exec($(colorNode).attr('style'));
            const child = $(colorNode).next();
            const nameResult = child == null || child.html() == null ? null : child.html();
            primaryLanguage = new PrimaryLanguage({
              name: nameResult == null ? null : nameResult.trim(),
              color: regResult == null ? null : regResult[0],
            });
          }

          const starNode = $('.f6 .muted-link .octicon-star', el);
          let starCountStr;
          if (starNode != null) {
            starCountStr = $(starNode)
              .parent()
              .html()
              .replace(/^[\s\S]*svg>/g, '')
              .replace(/,/g, '');
          }

          const starCount = starCountStr == null ? null : parseInt(starCountStr.trim(), 10);

          const forkNode = $('.f6 .octicon-repo-forked', el);
          let forkCountStr;
          if (forkNode != null) {
            forkCountStr = $(forkNode)
              .parent()
              .html()
              .replace(/^[\s\S]*svg>/g, '')
              .replace(/,/g, '');
          }

          const forkCount = forkCountStr == null ? null : parseInt(forkCountStr.trim(), 10);

          const starsNode = $('.float-sm-right', el);
          let starsStr;
          if (starsNode != null) {
            starsStr = $(starsNode)
              .html()
              .replace(/^[\s\S]*svg>/g, '')
              .replace(/,/g, '')
              .trim();
          }

          let description;
          let descriptionHTML;
          const pDesc = $('p', el);
          let descriptionRawHtml = pDesc == null ? null : pDesc.html();
          descriptionRawHtml = descriptionRawHtml == null ? null : descriptionRawHtml.trim();
          if (descriptionRawHtml != null) {
            description = descriptionRawHtml
              .replace(/<g-emoji.*?>/g, '')
              .replace(/<\/g-emoji>/g, '')
              .replace(/<a.*?>/g, '')
              .replace(/<\/a>/g, '')
              .trim();
            descriptionHTML = `<div>${descriptionRawHtml}</div>`;
          }
          const buildBys = [];
          const avatarNodes = $('.avatar', el);
          if (avatarNodes != null && avatarNodes.length > 0) {
            avatarNodes.each((index, e) => {
              buildBys.push(
                new RepositoryBuildBy({
                  avatar: $(e).attr('src'),
                  username: $(e)
                    .attr('alt')
                    .replace(/@/g, ''),
                }),
              );
            });
          }
          const usernameNode = $('.text-normal', el);
          let username;
          if (usernameNode) {
            username = usernameNode
              .html()
              .replace('/', '')
              .trim();
          }

          const repoNode = $('.text-normal', el);
          let reponame;
          if (repoNode) {
            reponame = repoNode
              .parent()
              .html()
              .replace(/[\s\S]*span>/g, '')
              .trim();
          }

          repositories.push(
            new TrendingRepository({
              owner: username,
              avatar: `${URL}/${username}.png`,
              name: reponame,
              description,
              descriptionHTML,
              starCount,
              forkCount,
              stars: starsStr,
              primaryLanguage,
              buildBys,
            }),
          );
        });
        resolve(repositories);
      })
      .catch(error => {
        reject(error);
      });
  });

const getTrendingDevelopers = ({ since, language } = {}) =>
  new Promise((resolve, reject) => {
    let uri = `${URL}/trending/developers`;
    if (language) {
      uri += `/${language}`;
    }
    if (since) {
      uri += `?since=${since}`;
    }
    rp({ ...options, uri })
      .then($ => {
        if (!$) {
          reject('response is null!');
          return
        }
        const developers = [];
        $('.Box-row').each((i, el) => {
          let popularRepository;
          const popularParentNode = $('.d-sm-flex .col-md-6', el);
          const popularNode = popularParentNode == null ? null : popularParentNode.last();

          if (popularNode != null) {
            let description;
            let descriptionHTML;
            const descriptionParentNode = $('.mt-1', popularNode);
            let descriptionRawHtml =
              descriptionParentNode == null ? null : descriptionParentNode.html();
            descriptionRawHtml = descriptionRawHtml == null ? null : descriptionRawHtml.trim();
            if (descriptionRawHtml != null) {
              description = descriptionRawHtml
                .replace(/<g-emoji.*?>/g, '')
                .replace(/<\/g-emoji>/g, '')
                .replace(/<a.*?>/g, '')
                .replace(/<\/a>/g, '')
                .trim();
              descriptionHTML = `<div>${descriptionRawHtml}</div>`;
            }
            const aNode = $('div>article>h1>a', popularNode);
            const url = aNode == null ? null : $(aNode).attr('href');
            let name;
            if (aNode) {
              name = $(aNode)
                .text()
                .trim();
            }

            popularRepository = new PopularRepository({
              url,
              name,
              description,
              descriptionRawHtml: descriptionHTML,
            });
          }

          const avatarNode = $('.rounded-1', el);
          const usernameNode = $('.link-gray', el);
          const nicknameNode = $('.d-md-flex', el);
          let avatar;
          if (avatarNode) {
            avatar = $(avatarNode)
              .attr('src')
              .trim();
          }
          let username;
          if (usernameNode) {
            username = $(usernameNode)
              .html()
              .trim();
          }
          let nickname;
          if (nicknameNode) {
            nickname = $('.lh-condensed', nicknameNode)
              .children()
              .first()
              .text()
              .trim();
          }

          developers.push(
            new TrendingDeveloper({
              avatar,
              username,
              nickname,
              popularRepository,
            }),
          );
        });
        resolve(developers);
      })
      .catch(error => {
        reject(error);
      });
  });

module.exports = {
  TrendingRepository,
  PrimaryLanguage,
  RepositoryBuildBy,
  TrendingDeveloper,
  PopularRepository,

  TrendingSince,
  TrendingType,

  getTrendingRepositories,
  getTrendingDevelopers,
};
