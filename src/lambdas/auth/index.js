exports.handler = async event => {
  switch (event.pathParameters.action) {
    case "login": {
      return {
        statusCode: 301,
        headers: {
          Location: `https://www.facebook.com/v4.0/dialog/oauth?client_id=${process.env.client_id}&state=appstate123&scope=manage_pages&redirect_uri=https://ur7a2a7vgj.execute-api.us-east-1.amazonaws.com/prod/auth/callback`
        }
      };
    }
    case "callback": {
      return {
        statusCode: 200,
        body: JSON.stringify(event)
      };
    }
    case "default": {
      return {
        statusCode: 400
      };
    }
  }
};
