const axios = require("axios").default;

module.exports = {
  getPerson: () => axios.get("https://uinames.com/api/?region=italy")
};
