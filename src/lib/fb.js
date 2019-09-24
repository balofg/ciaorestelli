const { default: axios } = require("axios");

const buildUrl = (endpoint, queryStringParams = {}) => {
  const url = new URL(endpoint, "https://graph.facebook.com/v4.0");

  Object.keys(queryStringParams).forEach(key =>
    url.searchParams.append(key, queryStringParams[key])
  );

  return url.href;
};

module.exports = {
  getUserAccessToken: code =>
    axios.get(
      buildUrl("oauth/access_token", {
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        redirect_uri: process.env.redirect_uri,
        code
      })
    ),
  getPageAccessToken: (pageId, accessToken) =>
    axios.get(
      buildUrl(pageId, { fields: "access_token", access_token: accessToken })
    ),
  listPages: accessToken =>
    axios.get(buildUrl("/me/accounts", { access_token: accessToken })),
  postToPage: (pageId, message, pageToken) =>
    axios.post(buildUrl(`${pageId}/feed`, { access_token: pageToken }), {
      message
    })
};
