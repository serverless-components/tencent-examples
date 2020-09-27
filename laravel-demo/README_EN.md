# Quickly create and deploy a laravel-demo application

[中文](./README.md) | **English**

## Introduction

Easily deploy laravel-demo applications to Tencent Cloud's serverless infrastructure using this Serverless Framework Component.
Your application will auto-scale, never charge you for idle time, and require little-to-zero administration.

## Quick Start

### 1. Install

```bash
# Install Serverless Framework
npm install -g serverless
```

### 2. Initialize

Initializing the laravel-demo template by running this following command:

```bash
serverless init laravel-demo
```

### 3. Deploy

You can user following command to deploy the APP.

```bash
serverless deploy
```

This command will walk you through signing up a Tencent Cloud Account to deploy the APP.

### 4. Monitor

Anytime you need to know more about your running express instance, you can run `serverless info` to view the most critical info. 
This is especially helpful when you want to know the outputs of your instances so that you can reference them in another instance. 
You will also see a url where you'll be able to view more info about your instance on the Serverless Dashboard.

It also shows you the status of your instance, when it was last deployed, and how many times it was deployed. 
To dig even deeper, you can pass the --debug flag to view the state of your component instance in case the deployment failed for any reason.

```bash
serverless info
```

### 5. Remove

If you wanna tear down your entire infrastructure that was created during deployment, 
just run `serverless remove --all` and serverless will remove all the data it needs from the built-in state storage system to delete only the relevant cloud resources that it created.

```bash
serverless remove --all
```

### Setting up credentials (Optional)

By default, you are able to login your Tencent Cloud account by scanning QR code and an `.env` file with credentials is auto generated.

By default, the credentials will be expired after 2 hours.
If you would like to use persistent credentials, 
you can [create an API Key here]((https://console.cloud.tencent.com/cam/capi) and add the `SecretId` and `SecretKey` into the `.env` file

> If you don's have a Tencent Cloud Account, you can register [here](https://cloud.tencent.com/register)。

```bash
touch .env # Adddd in your Tencent credentials here
```


```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```