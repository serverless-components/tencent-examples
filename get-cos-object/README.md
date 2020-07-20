## 概述
	
本示例配置了 COS 触发器，当有文件上传到对应的 COS bucket时，会触发云函数执行，并把文件下载到本地临时目录，用做后续处理。

使用组件：

- **SCF：** 快速创建并部署一个云函数
- **COS:** 快速创建一个COS存储桶

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
$ serverless init -t mytest-demo
```

2.创建 `.env` 文件，在里面输入您的账户、密钥信息

```
# .env
TENCENT_APP_ID=xxx
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

```

### 部署

执行 ` sls deploy --all ` 命令进行部署：

```bash

serverless ⚡ framework

april-bucket: 
  region:        ap-guangzhou
  bucket:        ocr-bucket-00000000
  cosOrigin:     ocr-bucket-00000000.cos.ap-guangzhou.myqcloud.com
  url:           https://ocr-bucket-00000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

april-func: 
    functionName: april-func
    runtime:      Nodejs8.9
    namespace:    default
  vendorMessage: null
  
17s › mytest-demo › Success
```

### 移除
执行 `sls remove --all`，可移除项目。

```bash
$  sls remove --all

serverless ⚡ framework

11s › mytest-demo › Success
```
