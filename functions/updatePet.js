// POST /pet/{petId}
const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");


exports.updatePet = async (ddbClient, petId, petName, status) => {

    console.log("updating pet:",petId, petName, status)

    const params = {
        TableName: "pet-table-dev",
        Key: {
          petId: { N: petId },          
        },
        UpdateExpression: "SET petName = :pn, stat = :st",
        ExpressionAttributeValues: { ":pn": { S: petName}, ":st": { S: status } },
        // ReturnConsumedCapacity: "TOTAL",
        ReturnValues: "ALL_OLD"
      };

    try {
        const data = await ddbClient.send(new UpdateItemCommand(params));
        if(!data.Attributes) {
          console.log("Pet doesn't exist, so we're creating a new one")
          return({ "message": "Pet doesn't exist, so we're creating a new one"})
        }
        console.log(data.Attributes);
        return({ "message": "Pet updated", "Pet" : { "petId": petId, "petName": petName, "status": status }})
      } catch (err) {
        console.error(err);
        return({ "message": err})
      }

}