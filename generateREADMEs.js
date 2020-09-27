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

### 2. 配置

通过如下命令直接下载该例子：

\`\`\`bash
serverless init ${templateName}
\`\`\`

### 3. 部署

通过\`serverless deploy\`命令进行部署，并可以添加\`--debug\`参数查看部署过程中的信息

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过\`微信\`扫描命令行中的二维码进行授权登陆和注册。

\`\`\`bash
serverless deploy
\`\`\`

### 4. 查看状态

执行以下命令，查看您部署的项目信息：

\`\`\`bash
serverless info
\`\`\`

### 5. 移除

可以通过以下命令移除 ${templateName} 应用

\`\`\`bash
serverless remove --all
\`\`\`

### 账号配置（可选）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 \`.env\` 文件

\`\`\`bash
$ touch .env # 腾讯云的配置信息
\`\`\`

在 \`.env\` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存

如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

如果已有腾讯云账号，可以在[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取 \`SecretId\` 和\`SecretKey\`.

\`\`\`
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
\`\`\`
`;

const generateReadmeEN = (templateName) => `# Quickly create and deploy a ${templateName} application

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
serverless init ${templateName}
\`\`\`

### 3. Deploy

You can user following command to deploy the APP.

\`\`\`bash
serverless deploy
\`\`\`

This command will walk you through signing up a Tencent Cloud Account to deploy the APP.

### 5. Remove

If you wanna tear down your entire infrastructure that was created during deployment, 
just run \`serverless remove --all\` and serverless will remove all the data it needs from the built-in state storage system to delete only the relevant cloud resources that it created.

\`\`\`bash
serverless remove --all
\`\`\`

### 账号配置（Optional）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 \`.env\` 文件

\`\`\`bash
$ touch .env # 腾讯云的配置信息
\`\`\`

在 \`.env\` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存

如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

如果已有腾讯云账号，可以在[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取 \`SecretId\` 和\`SecretKey\`.


\`\`\`
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
\`\`\`
`;


const folderNames = fs.readdirSync('./');

// console.log(folderNames);

folderNames.forEach(folderName => {
  const isDir = fs.statSync(folderName).isDirectory();
  const notTemplateFolders = ['.github', 'scripts']
  if (isDir && !notTemplateFolders.includes(folderName)) {
    const readmeCN = generateReadmeCN(folderName);
    fs.writeFileSync(path.join(folderName, 'README.md'), readmeCN, 'utf-8');

    const readmeEN = generateReadmeEN(folderName);
    fs.writeFileSync(path.join(folderName, 'README_EN.md'), readmeEN, 'utf-8'); 
  }
});

// console.log(fs.statSync('scripts').isDirectory());

