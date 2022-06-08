"use strict";

const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");

const Joi = require('joi');

const ddbClient = new DynamoDBClient({ region: "us-west-2" });

module.exports.index = async (event) => {
  var data = {}
  console.log(event)


// POST /pet
// create a new pet
  if (event.routeKey == 'POST /pet')
  {
    
    var body = Buffer.from(event.body, 'base64').toString('utf8') 
    var p = new URLSearchParams(body)
    var petId = p.get('petId')
    var petName = p.get('petName')
    var stat = p.get('stat')


    const schema = Joi.object({
      petId: Joi.number().required(),
      petName: Joi.string().alphanum().min(3).required(),
      stat: Joi.string().valid('available','pending','sold').required()
    })
    
    const { error, value } = schema.validate({petId, petName, stat})

    if (error) {
      console.log(error)
      return({ "message": error.details[0].message})
    }

    const { addPet } = require("./functions/addPet")
    data = await addPet(ddbClient, petId, petName, stat)



    
  // GET /pet/{petId}
  // get single pet data
  }else if (event.routeKey == 'GET /pet/{petId}')
  {
    // console.log('get pet data')
    var petId = event.pathParameters.petId

    const schema = Joi.object({
      petId: Joi.number().required(),
    })
    
    const { error, value } = schema.validate({petId})

    if (error) {
      console.log(error)
      return({ "message": error.details[0].message})
    }
    
    const { getPet } = require("./functions/getPet")
    data = await getPet(ddbClient, petId)


  // POST /pet/{petId}/uploadImage
  // upload image
  }else if (event.routeKey == 'POST /pet/{petId}/uploadImage') {


    var body = Buffer.from(event.body, 'base64').toString('utf8') 
    var p = new URLSearchParams(body)
    var filename = p.get('filename')
    var petId = event.pathParameters.petId

      const schema = Joi.object({
        petId: Joi.number().required(),
        filename: Joi.string().min(3).required()
      })
      
      const { error, value } = schema.validate({petId, filename})

      if (error) {
        console.log(error)
        return({ "message": error.details[0].message})
      }     

      // filename = "asdf.jpg"

      const { addImage } = require("./functions/addImage")
      data = await addImage(ddbClient, petId, filename)
      
      


  // POST /pet/{petId}
  // update pet data
    } else if (event.routeKey == 'POST /pet/{petId}')
    {
      var petId = event.pathParameters.petId

      var body = Buffer.from(event.body, 'base64').toString('utf8') 
      var p = new URLSearchParams(body)

      var petName = p.get('petName')
      var stat = p.get('stat')

      const schema = Joi.object({
        petId: Joi.number().required(),
        petName: Joi.string().min(3).required(),
        stat: Joi.string().valid('available','pending','sold').min(3).alphanum().required()
      })
      
      const { error, value } = schema.validate({petId, petName, stat})

      if (error) {
        console.log(error)
        return({ "message": error.details[0].message})
      }

      const { updatePet } = require("./functions/updatePet")
      data = await updatePet(ddbClient, petId, petName, stat)

    
// GET /pet/findByStatus
// list all pets by status 
  }else if (event.routeKey == 'GET /pet/findByStatus')
  {
    var query = event.queryStringParameters

    var stat

    if(query['stat']){
      stat = query['stat'].split(",")
    }

    const schema = Joi.object({
      stat: Joi.array().items(Joi.string().valid('available','pending','sold').min(3).alphanum()).required()
    })
    
    const { error, value } = schema.validate({stat})

    if (error) {
      console.log(error)
      return({ "message": error.details[0].message})
    }

    const { findByStatus} = require("./functions/findByStatus")
    data = await findByStatus(ddbClient, stat)


  
// DELETE /pet/{petId}
// delete pet
  }else if (event.routeKey == 'DELETE /pet/{petId}')
  {
    var petId = event.pathParameters.petId

    const schema = Joi.object({
      petId: Joi.number().required(),
    })      
    const { error, value } = schema.validate({petId})
    if (error) {
      console.log(error)
      return({ "message": error.details[0].message})
    }

    const { deletePet } = require("./functions/deletePet")
    data = await deletePet(ddbClient, petId)



// POST /store/order
// Create new order
  } else if (event.routeKey == 'POST /store/order')
  {

    var body = Buffer.from(event.body, 'base64').toString('utf8') 
    var p = new URLSearchParams(body)
    var orderId = p.get('orderId')
    var petId = p.get('petId')
    var quantity = p.get('quantity')
    var stat = p.get('stat')

    const schema = Joi.object({
      orderId: Joi.number().required(),
      petId: Joi.number().required(),
      quantity: Joi.number().required(),
      stat: Joi.string().valid('placed','approved','delivered').alphanum().required()
    })
    
    const { error, value } = schema.validate({orderId, petId, quantity, stat})

    if (error) {
      console.log(error)
      return({ "message": error.details[0].message})
    }

    const { storeOrder } = require("./functions/storeOrder")
    data = await storeOrder(ddbClient, orderId, petId, quantity, stat)
    
// GET /store/order/{orderId}
// Get order
  }else if (event.routeKey == 'GET /store/order/{orderId}')
  {
    var orderId = event.pathParameters.orderId

    const schema = Joi.object({
      orderId: Joi.number().required(),
    })
    
    const { error, value } = schema.validate({orderId})

    if (error) {
      console.log(error)
      return({ "message": error.details[0].message})
    }
    
    const { storeFindOrder } = require("./functions/storeFindOrder")
    data = await storeFindOrder(ddbClient, orderId)


// DELETE /store/order/{orderId}
// Delete order
  }else if (event.routeKey == 'DELETE /store/order/{orderId}')
  {
    var orderId = event.pathParameters.orderId

    const schema = Joi.object({
      orderId: Joi.number().required(),
    })
    
    const { error, value } = schema.validate({orderId})

    if (error) {
      console.log(error)
      return({ "message": error.details[0].message})
    }
    
    const { storeDeleteOrder } = require("./functions/storeDeleteOrder")
    data = await storeDeleteOrder(ddbClient, orderId)


// GET /store/order/inventory
// Get entire inventory
  }else if (event.routeKey == 'GET /store/order/inventory')
  {
    const { storeInventory } = require("./functions/storeInventory")
    data = await storeInventory(ddbClient)

// If route is invalid
  }else {
    console.log("invalid route")
    data = { "message": "Invalid route"}
  }

  

  const response = {
      statusCode: 200,
      body: JSON.stringify(data),
  };
  return response;



  
};
