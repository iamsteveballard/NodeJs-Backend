// GET /store/order/{orderId}
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");

exports.storeFindOrder = async (ddbClient, orderId) => {


    const params = {
        TableName: "store-table-dev",
        Key: {
            orderId: { N: orderId },          
        },
        // ReturnConsumedCapacity: "TOTAL",
      };
        const data = await ddbClient.send(new GetItemCommand(params));
        if(!data.Item) {
            console.log("order doesn't exist")
            return({ "message": "Order doesn't exist"})
        }else {
          console.log("data.Item:",data.Item);
        }
    return data.Item;

}