const fs = require('fs');
const path = require('path');

const generateReadmeCN = (templateName) => `# 快速构建 ${templateName}

**中文** | [English](./README_EN.md)

## 简介

${templateName} 模板使用 Tencent SCF 组件及其触发器能力，方便的在腾讯云创建，配置和管理一个 ${templateName} 应用。

## 快速开始

### 1. 安装

\`\`\`bash
# 安装 Serverless Framework
npm install -g serverless
\`\`\`

### 2. 创建

通过如下命令直接下载该例子：

\`\`\`bash
serverless init ${templateName} --name example
cd example
\`\`\`

### 3. 部署

在 \`serverless.yml\` 文件所在的项目根目录，运行以下指令，将会弹出二维码，直接扫码授权进行部署：

\`\`\`bash
serverless deploy
\`\`\`

> **说明**：如果鉴权失败，请参考 [权限配置](https://cloud.tencent.com/document/product/1154/43006) 进行授权。

### 4. 查看状态

执行以下命令，查看您部署的项目信息：

\`\`\`bash
serverless info
\`\`\`

### 5. 移除

可以通过以下命令移除 ${templateName} 应用

\`\`\`bash
serverless remove
\`\`\`

### 账号配置（可选）

serverless 默认支持扫描二维码登录，用户扫描二维码后会自动生成一个 \`.env\` 文件并将密钥存入其中.
如您希望配置持久的环境变量/秘钥信息，也可以本地创建 \`.env\` 文件, 
把从[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取的 \`SecretId\` 和\`SecretKey\` 填入其中.

> 如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

\`\`\`bash
# 腾讯云的配置信息
touch .env
\`\`\`

\`\`\`
# .env file
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
\`\`\`
`;

const generateReadmeEN = (templateName) => `# Quickly create and deploy ${templateName} application

[中文](./README.md) | **English**

## Introduction

Easily deploy ${templateName} applications to Tencent Cloud's serverless infrastructure using this Serverless Framework Component.
Your application will auto-scale, never charge you for idle time, and require little-to-zero administration.

## Quick Start

### 1. Install

\`\`\`bash
# Install Serverless Framework
npm install -g serverless
\`\`\`

### 2. Initialize

Initializing the ${templateName} template by running this following command:

\`\`\`bash
serverless init ${templateName} --name example
cd example
\`\`\`

### 3. Deploy

You can use following command to deploy the APP.

\`\`\`bash
cd ${templateName}
serverless deploy
\`\`\`

This command will walk you through signing up a Tencent Cloud Account to deploy the APP.

### 4. Monitor

Anytime you need to know more about your running express instance, you can run \`serverless info\` to view the most critical info. 
This is especially helpful when you want to know the outputs of your instances so that you can reference them in another instance. 
You will also see a url where you'll be able to view more info about your instance on the Serverless Dashboard.

It also shows you the status of your instance, when it was last deployed, and how many times it was deployed. 
To dig even deeper, you can pass the --debug flag to view the state of your component instance in case the deployment failed for any reason.

\`\`\`bash
serverless info
\`\`\`

### 5. Remove

If you wanna tear down your entire infrastructure that was created during deployment, 
just run \`serverless remove\` and serverless will remove all the data it needs from the built-in state storage system to delete only the relevant cloud resources that it created.

\`\`\`bash
serverless remove
\`\`\`

### Setting up credentials (Optional)

By default, you are able to login your Tencent Cloud account by scanning QR code and an \`.env\` file with credentials is auto generated.
The credentials will be expired after 2 hours.
If you would like to use persistent credentials, 
you can [create an API Key here](https://console.cloud.tencent.com/cam/capi) and add the \`SecretId\` and \`SecretKey\` into the \`.env\` file

> If you don's have a Tencent Cloud Account, you can register [here](https://cloud.tencent.com/register)

\`\`\`bash
# Add your Tencent credentials here
touch .env
\`\`\`


\`\`\`
# .env file
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
\`\`\`
`;


const folderNames = fs.readdirSync('./');

// console.log(folderNames);

folderNames.forEach(folderName => {
  const isDir = fs.statSync(folderName).isDirectory();
  const notTemplateFolders = ['.git', '.github', 'scripts'];

  // is template folder
  if (isDir && !notTemplateFolders.includes(folderName)) {
    const readmeCN = generateReadmeCN(folderName);
    fs.writeFileSync(path.join(folderName, 'README.md'), readmeCN, 'utf-8');

    const readmeEN = generateReadmeEN(folderName);
    fs.writeFileSync(path.join(folderName, 'README_EN.md'), readmeEN, 'utf-8'); 
    console.log('README.md and README_EN.md are generated for', folderName);
  }
});

// console.log(fs.statSync('scripts').isDirectory());

