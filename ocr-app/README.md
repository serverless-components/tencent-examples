# Serverless OCR 文字识别模版

## 概述
本文档将为您介绍，如何通过 Serverless Framework 组件，快速部署一个 OCR 文字识别应用。

使用组件：

- **Serverless Express：** 通过云函数和 API 网关构建的Express框架实现 RESTful API。
- **Serverless Website：** 前端通过托管 React 静态页面到 COS 对象存储中。
- **COS:** 用户通过自己创建存储桶来存放目标图像

## 前提条件

- 已安装 [Node.js](https://nodejs.org/en/)（Node.js 版本需不低于 8.6，建议使用Node.js10.0 及以上版本）
- 已开通 OCR 服务


## 操作步骤

### 安装

通过 npm 全局安装 [Serverless Framework](https://github.com/serverless/serverless)：

```shell
$ npm install -g serverless
```

如果之前您已经安装过 Serverless Framework，可以通过下列命令升级到最新版：

```shell
$ npm update -g serverless
```

安装完毕后，通过运行 serverless -v 命令，查看 Serverless Framework 的版本信息，确保版本信息不低于以下版本：

```shell
$ serverless –v
Framework Core: 1.67.3
Plugin: 3.6.6
SDK: 2.3.0
Components: 2.30.1
```

### 配置

1.初始化相关 template。

```console
$ serverless init -t ocr-app
```

2.在项目模板中找到 `.env.example` 文件，修改名称为 `.env`，并在其中配置对应的腾讯云 SecretId 和 SecretKey 等信息：

```
TENCENT_APP_ID=xxx
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# region of bucket
REGION=ap-guangzhou
# bucket name, using to store upload pictures
BUCKET=ocr-images
```

> 说明：

- 如果没有腾讯云账号，请先 [注册新账号](https://cloud.tencent.com/register)。
- 如果已有腾讯云账号，请保证您的账号已经授权了 AdministratorAccess 权限。 您可以
  在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取AppId, SecretId
  和 SecretKey。


3.下载所有npm依赖

```console
$ npm run bootstrap
```

### 部署

1.执行以下命令进行部署：

```bash
$ sls deploy --all

serverless ⚡ framework

ocr-bucket: 
  region:        ap-guangzhou
  bucket:        ocr-bucket-00000000
  cosOrigin:     ocr-bucket-00000000.cos.ap-guangzhou.myqcloud.com
  url:           https://ocr-bucket-00000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

ocr-backend: 
  region:        ap-guangzhou
  apigw: 
    serviceId:   service-46ddbfoo
    subDomain:   service-46ddbfoo-00000000.gz.apigw.tencentcs.com
    environment: release
    url:         https://service-46ddbfoo-00000000.gz.apigw.tencentcs.com/release/
  scf: 
    functionName: ocr-backend
    runtime:      Nodejs10.15
    namespace:    default
  vendorMessage: null

ocr-frontend: 
  region:        ap-guangzhou
  website:       https://ocr-app-00000000.cos-website.ap-guangzhou.myqcloud.com
  vendorMessage: null


38s › serverless-ocr › Success

```

部署成功后，您可以使用浏览器访问项目产生的 website 链接，即可看到生成的网站，点击上传图片，项目即可通过OCR SDK完成文字识别。


2.执行 `sls remove --all`，可移除项目。

```bash
$  sls remove --all

serverless ⚡ framework

38s › tencent-fullstack › Success
```
