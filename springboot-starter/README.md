# 快速构建 springboot-starter

**中文** | [English](./README_EN.md)

## 简介

springboot-starter 模板使用 Tencent SCF 组件及其触发器能力，方便的在腾讯云创建，配置和管理一个 springboot-starter 应用。

## 快速开始

### 1. 安装

```bash
# 安装 Serverless Framework
npm install -g serverless
```

### 2. 创建

通过如下命令直接下载该例子：

```bash
serverless init springboot-starter --name example
cd example
```

### 3. 部署

1. 将代码用 `Maven` 创建 `jar` 部署包或者用 `Gradle` 创建 `zip` 部署包

- 云函数关于 Maven 部署包的说明：[点此查看](https://cloud.tencent.com/document/product/583/12217)
- 云函数关于 Gradle 部署包的说明：[点此查看](https://cloud.tencent.com/document/product/583/12216)

2. 将部署包放在与 `serverless.yml` 同级的目录下，并修改 `serverless.yml` 中的 `projectJarName` 为部署包的文件名称

> 如：使用 Maven 打包后生成了 code.jar 文件，则 projectJarName 为 `code.jar`

3. 在 `serverless.yml` 文件所在的项目根目录，运行以下指令，将会弹出二维码，直接扫码授权进行部署：

```bash
serverless deploy
```

> **说明**：如果鉴权失败，请参考 [权限配置](https://cloud.tencent.com/document/product/1154/43006) 进行授权。 如若使用自己的代码部署，请参考 [组件说明](https://github.com/serverless-components/tencent-springboot) 进行改造。

### 4. 查看状态

执行以下命令，查看您部署的项目信息：

```bash
serverless info
```

### 5. 移除

可以通过以下命令移除 springboot-starter 应用

```bash
serverless remove
```

### 账号配置（可选）

serverless 默认支持扫描二维码登录，用户扫描二维码后会自动生成一个 `.env` 文件并将密钥存入其中.
如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件,
把从[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取的 `SecretId` 和`SecretKey` 填入其中.

> 如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

```bash
# 腾讯云的配置信息
touch .env
```

```
# .env file
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```
