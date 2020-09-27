# Quickly create and deploy a flask-demo application

[中文](./README.md) | **English**

## Introduction

Easily deploy flask-demo applications to Tencent Cloud's serverless infrastructure using this Serverless Framework Component.
Your application will auto-scale, never charge you for idle time, and require little-to-zero administration.

## Quick Start

### 1. Install

```bash
# Install Serverless Framework
npm install -g serverless
```

### 2. Initialize

Initializing the flask-demo template by running this following command:

```bash
serverless init flask-demo
```

### 3. Deploy

You can user following command to deploy the APP.

```bash
serverless deploy
```

This command will walk you through signing up a Tencent Cloud Account to deploy the APP.

### 5. Remove

If you wanna tear down your entire infrastructure that was created during deployment, 
just run `serverless remove --all` and serverless will remove all the data it needs from the built-in state storage system to delete only the relevant cloud resources that it created.

```bash
serverless remove --all
```

### 账号配置（Optional）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件

```bash
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存

如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

如果已有腾讯云账号，可以在[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取 `SecretId` 和`SecretKey`.


```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```
