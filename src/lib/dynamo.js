const { DynamoDB } = require("aws-sdk");

const dynamo = new DynamoDB();

const SETTINGS_TABLENAME = "FBCiaoRestelliSettings";

module.exports = {
  settings: {
    USER_TOKEN: "userToken"
  },
  getSetting: setting =>
    new Promise((resolve, reject) => {
      dynamo.getItem(
        {
          TableName: SETTINGS_TABLENAME,
          Key: {
            id: { S: setting }
          }
        },
        (error, data) => {
          if (error) {
            return reject(error);
          }

          if (data && data.Item) {
            return resolve(data.Item.value.S);
          }

          return resolve(null);
        }
      );
    }),
  updateSetting: (setting, value) =>
    new Promise((resolve, reject) => {
      dynamo.updateItem(
        {
          TableName: SETTINGS_TABLENAME,
          Key: {
            id: { S: setting }
          },
          ExpressionAttributeNames: {
            "#value": "value"
          },
          ExpressionAttributeValues: {
            ":value": {
              S: value
            }
          },
          UpdateExpression: "SET #value = :value"
        },
        error => {
          if (error) {
            return reject(error);
          }

          return resolve();
        }
      );
    })
};
