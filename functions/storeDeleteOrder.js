//  DELETE /store/order/{orderId}
const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

exports.storeDeleteOrder = async (ddbClient, orderId) => {

    const params = {
        TableName: "store-table-dev",
        Key: {
            orderId: { N: orderId },          
        },
        // ReturnConsumedCapacity: "TOTAL",
        ReturnValues: "ALL_OLD"
      };

        const data = await ddbClient.send(new DeleteItemCommand(params));
        if(!data.Attributes) {
          console.log("Can't delete: order doesn't exist")
          return("Order doesn't exist")
        }else {
          console.log("deleting:",data.Attributes);
        }
        // console.log(data);
    return({ "message": "Order deleted"})
}