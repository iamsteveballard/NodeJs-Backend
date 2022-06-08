const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const ddbClient = new DynamoDBClient({ region: "us-west-2" });

describe("Test Pet add and delete functions", () => {

    const petId = ""+Math.floor(Math.random()*92345+9999)

    test("It should successfully add pet", async () => {

        const petName = "test pet"
        const stat = 'sold'

        const { addPet } = require("../functions/addPet")
        const data = await addPet(ddbClient, petId, petName, stat)
        
        expect(data).toEqual({"message" : "Pet created"})

    })

    test("It should successfully add image to pet", async () => {

        const filename = "test.jpg"

        const { addImage } = require("../functions/addImage")
        const data = await addImage(ddbClient, petId, filename)
        
        expect(data.message).toEqual("Image added to pet profile")

    })

    test("It should get data about pet", async () => {

        const newfilename = ""+petId+"/test.jpg"

        const { getPet } = require("../functions/getPet")
        const data = await getPet(ddbClient, petId)
        
        expect(data).toEqual({"petId" : { "N" : petId }, 
                            "petName" : { "S" : "test pet"}, 
                            "photoUrls" : { "SS" : [newfilename]},
                            "stat": { "S": "sold"},                            
                        })

    })

    test("It should delete the added pet", async () => {
        
        const { deletePet } = require("../functions/deletePet")
        const data = await deletePet(ddbClient, petId)

        expect(data).toEqual({"message" : "Pet deleted"})

    })

})