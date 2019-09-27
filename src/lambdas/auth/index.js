const dynamo = require("../../lib/dynamo");
const fb = require("../../lib/fb");

exports.handler = async event => {
  switch (event.pathParameters.action) {
    case "login": {
      return {
        statusCode: 301,
        headers: {
          'Cache-Control': "private, max-age=0, no-cache",
          Location: `https://www.facebook.com/v4.0/dialog/oauth?client_id=${process.env.client_id}&state=appstate123&scope[]=manage_pages&scope[]=publish_pages&redirect_uri=${process.env.redirect_uri}`
        }
      };
    }
    case "callback": {
      if (!event.queryStringParameters || !event.queryStringParameters.code) {
        return {
          statusCode: 400,
          body: "What do you think you're doing?"
        };
      }

      const accessTokenResponse = await fb.getUserAccessToken(
        event.queryStringParameters.code
      );

      if (!accessTokenResponse.data) {
        console.error("access token error", accessTokenResponse);

        return {
          statusCode: 500,
          body: "There was an error getting the Access Token from Facebook."
        };
      }

      const debugTokenResponse = await fb.debugToken(
        accessTokenResponse.data.access_token
      );

      if (!debugTokenResponse.data) {
        console.error("debug token error", debugTokenResponse);

        return {
          statusCode: 500,
          body: "There was an error getting the Debug Token from Facebook."
        };
      }

      if (debugTokenResponse.data.data.user_id !== process.env.user_id) {
        console.error("user not allowed");

        return {
          statusCode: 403,
          body: "Go away or I'll call the police."
        };
      }

      await dynamo.updateSetting(
        dynamo.settings.USER_TOKEN,
        accessTokenResponse.data.access_token
      );

      return {
        statusCode: 200,
        body: "Ok, go away now."
      };
    }
    case "default": {
      return {
        statusCode: 400,
        body: "What do you think you're doing?"
      };
    }
  }
};
