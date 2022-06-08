// GET /pet/findByStatus
const { ScanCommand } = require("@aws-sdk/client-dynamodb");

exports.findByStatus = async (ddbClient, stat) => {

    console.log("pets with status:",stat)


    filterExp = ""
    ExpressionAttr = {}

    for(var i = 0; i< stat.length; i++){
      if (i == stat.length-1) {
        filterExp += "stat = :"+i              
      }else{
        filterExp += "stat = :"+i+" OR "
      }
      val = ":"+i+"" 
      newObj = {}
      newObj[val] =  { S: stat[i]}
      Object.assign(ExpressionAttr, newObj)
    }
    // console.log(filterExp)
    // console.log(ExpressionAttr)

    const params = {
        TableName: "pet-table-dev",
        FilterExpression: filterExp,
        ExpressionAttributeValues: ExpressionAttr,
        ProjectionExpression:"petId, stat, petName, photoUrls",
        ReturnConsumedCapacity: "TOTAL",
    };

    try {
        const data = await ddbClient.send(new ScanCommand(params));
        console.log(data.Items)
        console.log(data.ConsumedCapacity)
        return data.Items;
      } catch (err) {
        console.log("Error", err);
        return({ "message": err})
      }
}