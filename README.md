<!--
title: 'NodeJS Petstore Lambda Api'
description: 'This is a NodeJS backend project implementing the Petstore'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
-->

# NodeJS Petstore Lambda Api

This is a NodeJS Project built with AWS APIGateway and Lambda. It's launched with the Serverless framework to make development easy. 

## Usage

### Deployment

```
$ serverless deploy
```

After deploying, you should see output similar to:

```bash
Deploying http-api to stage dev (us-west-2, "default-provider" provider)

✔ Service deployed to stack aws-node-http-api-project-dev (52s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  PetsApiFunction: http-api-dev-PetsApiFunction (4.2 MB) 
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```


### Local development

You can update the lambda function quickly without redeploying the whole stack by using the following command:

```bash
serverless deploy function -f PetsApiFunction
```