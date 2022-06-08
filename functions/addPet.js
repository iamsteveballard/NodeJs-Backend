// POST /pet
// import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");

exports.addPet =  async(ddbClient, petId, petName, stat) => {

    console.log("trying to add pet",petId, petName, stat)

    const params = {
        TableName: "pet-table-dev",
        Item: {
            petId: { N: petId },
            stat: { S: stat },        
            petName: { S: petName },
            // photoUrls: { SS: [] }
          
        },
        // ReturnConsumedCapacity: "TOTAL",
        ConditionExpression: "attribute_not_exists(petId)",
        ReturnValues: "ALL_OLD"
      };

      try {
        const data = await ddbClient.send(new PutItemCommand(params));
        // console.log(data)
        if(data.Attributes) {
          console.log("item already exist")
          return({ "message": "Overwriting Pet that already exist"})
        }else {
          console.log("creating:",params.Item);
          return({ "message": "Pet created"})
        }
        
      } catch (err) {
        // console.error(err);
        console.log("Not creating. Pet already exist")
        return({ "message": "Not creating. Pet already exist"})
      }
}
