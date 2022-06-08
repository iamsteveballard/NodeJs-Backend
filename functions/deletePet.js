//  DELETE /pet/{petId}

const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

exports.deletePet = async (ddbClient, petId) => {

    console.log("Trying to delete:",petId)


    const params = {
        TableName: "pet-table-dev",
        Key: {
          petId: { N: petId },          
        },
        // ReturnConsumedCapacity: "TOTAL",
        ReturnValues: "ALL_OLD"
      };

    try {
        const data = await ddbClient.send(new DeleteItemCommand(params));
        if(!data.Attributes) {
          console.log("Can't delete: item doesn't exist")
          return("Item doesn't exist")
        }else {
          console.log("deleting:",data.Attributes);
        }
        // console.log(data);
        return({ "message": "Pet deleted"})
      } catch (err) {
        console.error(err);
        return({ "message": err})
      }

}