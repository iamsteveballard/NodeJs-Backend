// GET /pet/{petId}
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");

exports.getPet = async (ddbClient, petId) => {


    console.log("fetching pet data for id:",petId)

    const params = {
        TableName: "pet-table-dev",
        Key: {
            petId: { N: petId },          
        },
        // ReturnConsumedCapacity: "TOTAL",
    };

    const data = await ddbClient.send(new GetItemCommand(params));

    if(!data.Item) {
        console.log("item doesn't exist")
        return({ "message": "Pet doesn't exist"})
    }else {
        console.log("data.Item:",data.Item);
    }

    if (data.Item.photoUrls){
        console.log(data.Item.photoUrls.SS)
    }
    return data.Item;
}