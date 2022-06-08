// POST /pet/{petId}/uploadImage

const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { UpdateItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");

const client = new S3Client({ region: "us-west-2" });

exports.addImage= async (ddbClient, petId, filename) => {

    console.log("Trying to add image to:",petId, filename)

    // check if petId exists:
    const check = await ddbClient.send(new GetItemCommand({TableName: "pet-table-dev",  Key: { petId: { N: petId }}}));

    if(!check.Item) {
      console.log("Pet doesn't exist image not added")
      return("Pet doesn't exist, image not added")
    }

    // generate presigned url to upload directly to s3 from frontend
    const Bucket = "plasmatic-image-bucket-dev"
    const Key = petId+"/"+filename

    const { url, fields } = await createPresignedPost(client, {
        Bucket,
        Key,
        Expires: 600, //Seconds before the presigned post expires. 3600 by default.
      });

    const params = {
        TableName: "pet-table-dev",
        Key: {
          petId: { N: petId },          
        },
        UpdateExpression: "ADD photoUrls :pu",
        ExpressionAttributeValues: { ":pu": { SS: [fields.key] } },
        // ReturnConsumedCapacity: "TOTAL",
        ReturnValues: "ALL_OLD"
      };

    try {
        const data = await ddbClient.send(new UpdateItemCommand(params));
        console.log(data)
        
        const res ={}
        const newfilename = ""+petId+"/"+filename

        res["message"] = "Image added to pet profile"

        if(data.Attributes.photoUrls){
          res["urls"] = data.Attributes.photoUrls.SS

          if(res["urls"].includes(newfilename)){
            res["message"] = "Existing image overwritten"
          }else{
            const urlArr = new Array(res["urls"])
            urlArr.push(newfilename)
            res["urls"] = urlArr
          }

        } else {
          const urlArr = new Array()
          urlArr.push(newfilename)
          res["urls"] = urlArr
        }      

        res["upload"] = {"url":url, "fields":fields}
        
        return(res)
      } catch (err) {
        console.error(err);
        return({ "message": err})
      }

}