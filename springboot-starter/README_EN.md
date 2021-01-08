# Quickly create and deploy springboot-starter application

[中文](./README.md) | **English**

## Introduction

Easily deploy springboot-starter applications to Tencent Cloud's serverless infrastructure using this Serverless Framework Component.
Your application will auto-scale, never charge you for idle time, and require little-to-zero administration.

## Quick Start

### 1. Install

```bash
# Install Serverless Framework
npm install -g serverless
```

### 2. Initialize

Initializing the springboot-starter template by running this following command:

```bash
serverless init springboot-starter --name example
cd example
```

### 3. Deploy

1. Use `Maven` to create `jar` file or use `Gradle` to create `zip` file.

2. Put the `.jar/.zip` file in the same folder as `serverless.yml`，then update `serverless.yml` file's `projectJarName` property to your deploy file name

> E.g.：Use Maven to create `code.jar` then projectJarName property's value should be `code.jar`

3. You can use following command to deploy the APP.

```bash
cd springboot-starter
serverless deploy
```

This command will walk you through signing up a Tencent Cloud Account to deploy the APP.

> If you want to deloy with your code, please refer to the [SpringBoot Component README](https://github.com/serverless-components/tencent-springboot) to do the code change.

### 4. Monitor

Anytime you need to know more about your running springboot instance, you can run `serverless info` to view the most critical info.
This is especially helpful when you want to know the outputs of your instances so that you can reference them in another instance.
You will also see a url where you'll be able to view more info about your instance on the Serverless Dashboard.

It also shows you the status of your instance, when it was last deployed, and how many times it was deployed.
To dig even deeper, you can pass the --debug flag to view the state of your component instance in case the deployment failed for any reason.

```bash
serverless info
```

### 5. Remove

If you wanna tear down your entire infrastructure that was created during deployment,
just run `serverless remove` and serverless will remove all the data it needs from the built-in state storage system to delete only the relevant cloud resources that it created.

```bash
serverless remove
```

### Setting up credentials (Optional)

By default, you are able to login your Tencent Cloud account by scanning QR code and an `.env` file with credentials is auto generated.
The credentials will be expired after 2 hours.
If you would like to use persistent credentials,
you can [create an API Key here](https://console.cloud.tencent.com/cam/capi) and add the `SecretId` and `SecretKey` into the `.env` file

> If you don's have a Tencent Cloud Account, you can register [here](https://cloud.tencent.com/register)

```bash
# Add your Tencent credentials here
touch .env
```

```
# .env file
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```
