// GET /store/inventory
const { ScanCommand } = require("@aws-sdk/client-dynamodb");

exports.storeInventory = async (ddbClient) => {

    const params = {
        TableName: "storeorders",
        ProjectionExpression:"orderId, stat",
        ReturnConsumedCapacity: "TOTAL",
    };

    const data = await ddbClient.send(new ScanCommand(params));
    console.log(data.Items)
    console.log(data.ConsumedCapacity)

    const res = {}
    res["Approved"]=0
    res["Delivered"]=0
    res["Placed"]=0
    for (const [key,val] of Object.entries(data.Items)){
        if (val["stat"]["S"] == "approved"){
            res["Approved"]++
        }
        if (val["stat"]["S"] == "delivered"){
            res["Delivered"]++
        }
        if (val["stat"]["S"] == "placed"){
            res["Placed"]++
        }
    }
    console.log(res)

    return res;
}