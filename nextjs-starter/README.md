# 快速构建 nextjs-starter

**中文** | [English](./README_EN.md)

## 简介

nextjs-starter 模板使用 Tencent SCF 组件及其触发器能力，方便的在腾讯云创建，配置和管理一个 nextjs-starter 应用。

## 快速开始

### 1. 安装

```bash
# 安装 Serverless Framework
$ npm install -g serverless
```

### 2. 配置

通过如下命令直接下载该例子：

```bash
$ serverless init nextjs-starter
```

### 3. 部署

通过`serverless deploy`命令进行部署，并可以添加`--debug`参数查看部署过程中的信息

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过`微信`扫描命令行中的二维码进行授权登陆和注册。

```bash
$ cd nextjs-starter
$ serverless deploy
```

### 4. 查看状态

执行以下命令，查看您部署的项目信息：

```bash
$ serverless info
```

### 5. 移除

可以通过以下命令移除 nextjs-starter 应用

```bash
$ serverless remove
```

### 账号配置（可选）

serverless 默认支持扫描二维码登录，用户扫描二维码后会自动生成一个 `.env` 文件并将密钥存入其中.
如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件, 
把从[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取的 `SecretId` 和`SecretKey` 填入其中.

> 如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

```bash
$ touch .env # 腾讯云的配置信息
```

```
# .env file
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```
