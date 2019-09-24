const dynamo = require("../../lib/dynamo");
const fb = require("../../lib/fb");
const people = require("../../lib/people");

module.exports = {
  handler: async () => {
    const userToken = await dynamo.getSetting(dynamo.settings.USER_TOKEN);

    const pagesListResponse = await fb.listPages(userToken);

    if (!pagesListResponse.data) {
      console.error("page list error", pageListResponse);
      throw new Error("page list error");
    }

    const page = pagesListResponse.data.data.find(
      page => page.id === process.env.page_id
    );

    if (!page) {
      console.error(
        "page error",
        `cannot find page with id ${process.env.page_id}`
      );
      throw new Error("page error");
    }

    const pageTokenResponse = await fb.getPageAccessToken(page.id, userToken);

    if (!pageTokenResponse.data) {
      console.error("page token error", pageTokenResponse);
      throw new Error("page token error");
    }

    const pageToken = pageTokenResponse.data.access_token;

    const randomPersonResponse = await people.getPerson();

    if (!randomPersonResponse.data) {
      console.error("random person error", randomPersonResponse);
      throw new Error("random person error");
    }

    const person = randomPersonResponse.data;
    const message = `${person.name} ${person.surname} non saluta Restelli.`;

    await fb.postToPage(page.id, message, pageToken);
    
    // success
    console.info(message);
  }
};
