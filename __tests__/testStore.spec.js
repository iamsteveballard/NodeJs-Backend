const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const ddbClient = new DynamoDBClient({ region: "us-west-2" });

describe("Test order creation and deletion", () => {

    const orderId = ""+Math.floor(Math.random()*92345+9999)

    test("It should successfully add new order", async () => {

        const petId = "1111"
        const quantity = "1"
        const stat = "sold"

        const { storeOrder } = require("../functions/storeOrder")
        const data = await storeOrder(ddbClient, orderId, petId, quantity, stat)
        
        expect(data).toEqual({"message" : "Order created"})

    })

    test("It should delete the added order", async () => {
        
        const { storeDeleteOrder } = require("../functions/storeDeleteOrder")
        const data = await storeDeleteOrder(ddbClient, orderId)

        expect(data).toEqual({"message" : "Order deleted"})

    })

})