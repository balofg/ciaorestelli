const dynamo = require("../../lib/dynamo");
const fb = require("../../lib/fb");

exports.handler = async event => {
  switch (event.pathParameters.action) {
    case "login": {
      return {
        statusCode: 301,
        headers: {
          Location: `https://www.facebook.com/v4.0/dialog/oauth?client_id=${process.env.client_id}&state=appstate123&scope=manage_pages,publish_pages&redirect_uri=${process.env.redirect_uri}`
        }
      };
    }
    case "callback": {
      if (!event.queryStringParameters || !event.queryStringParameters.code) {
        return {
          statusCode: 400
        };
      }

      const accessTokenResponse = await fb.getUserAccessToken(
        event.queryStringParameters.code
      );

      if (!accessTokenResponse.data) {
        console.error(JSON.stringify(accessTokenResponse));

        return {
          statusCode: 500
        };
      }

      await dynamo.updateSetting(
        dynamo.settings.USER_TOKEN,
        accessTokenResponse.data.access_token
      );

      return {
        statusCode: 204
      };
    }
    case "default": {
      return {
        statusCode: 400
      };
    }
  }
};
