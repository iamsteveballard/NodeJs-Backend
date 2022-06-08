// POST /store/order
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");

exports.storeOrder=  async(ddbClient, orderId, petId, quantity, stat) => {

    const shipDate = new Date('05 June 2022 14:48 UTC')
    // console.log(shipDate.toString())
    // console.log(shipDate.toISOString())

    const params = {
        TableName: "store-table-dev",
        Item: {
            orderId: { N: orderId },
            petId: { N: petId },
            quantity: { N: quantity },
            shipDate: { S: shipDate.toISOString() },
            stat: { S: stat },        
            complete: { BOOL: true },
          
        },
        // ReturnConsumedCapacity: "TOTAL",
        ReturnValues: "ALL_OLD"
      };

    // console.log(params)
    // console.log('debug')
    const data = await ddbClient.send(new PutItemCommand(params));
        if(data.Attributes) {
          console.log("Overwriting order that already exist")
          return({ "message": "Overwriting order that already exist"})
        }else {
          console.log("Creating order:",params.Item);
        }
        // console.log(data);

    return({ "message": "Order created"})

}
