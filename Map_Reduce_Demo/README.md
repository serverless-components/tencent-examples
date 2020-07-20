# 快速构建 Map Reduce 实例

## 简介

基于 COS 触发器和云函数，通过 MapReduce 完成一个简单的 WordCount 实例。

## 实现流程
- 创建函数与 COS Bucket。
- 用户将对象上传到 COS 中的源存储桶（对象创建事件）。
- COS Bucket检测到对象创建事件。
- COS 调用函数并将事件数据作为参数传递给函数，由此将 cos:ObjectCreated:* 事件发布给函数。
- SCF 平台接收到调用请求，执行函数。
- 函数通过收到的事件数据获得了 Bucket 名称和文件名称，从该源 Bucket中获取该文件，根据代码中实现的 wordcount 进行字数统计，然后将其保存到目标 Bucket 上。

## 快速开始


1. [安装](#1-安装)
2. [配置](#2-配置)
3. [部署](#3-部署)
4. [调用](#4-调用)
5. [移除](#5-移除)

&nbsp;

### 1. 安装

通过npm安装 Serverless Framework

```console
$ npm install -g serverless
```

确保您的 Serverless Framework 不低于以下版本：

```shell
$ serverless –v
Framework Core: 1.74.1 (standalone)
Plugin: 3.6.14
SDK: 2.3.1
Components: 2.31.6
```


### 2. 配置

1) 通过如下命令直接初始化该模版：

```
serverless init -t mapreduce-demo
```
2) 在项目模板中找到.env.example 文件，修改名称为.env，并在其中配置对应的腾讯云 SecretId、SecretKey

```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

如果没有腾讯云账号，可以在此[注册新账号](https://cloud.tencent.com/register)。

如果已有腾讯云账号，可以在[API 密钥管理](https://console.cloud.tencent.com/cam/capi)中获取 `SecretId` 和`SecretKey`.



### 3. 部署

通过`sls deploy`命令进行部署

```console
$ sls deploy --all

serverless ⚡ framework

srcmr: 
  region:        ap-guangzhou
  bucket:        srcmr-0000000000
  cosOrigin:     srcmr-0000000000.cos.ap-guangzhou.myqcloud.com
  url:           http://srcmr-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

destmr: 
  region:        ap-guangzhou
  bucket:        destmr-0000000000
  cosOrigin:     destmr-0000000000.cos.ap-guangzhou.myqcloud.com
  url:           http://destmr-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

middlestagebucket: 
  region:        ap-guangzhou
  bucket:        middlestagebucket-0000000000
  cosOrigin:     middlestagebucket-0000000000.cos.ap-guangzhou.myqcloud.com
  url:           http://middlestagebucket-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

reduce_function: 
  functionName:  reduce_function
  description:   This is one of the MapReduce function which is reduce_function
  namespace:     default
  runtime:       Python2.7
  handler:       reduce_function.main_handler
  memorySize:    128
  lastVersion:   $LATEST
  traffic:       1
  triggers: 
    cos: 
      - middlestagebucket-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

map_function: 
  functionName:  map_function
  description:   This is one of the MapReduce function which is map_function
  namespace:     default
  runtime:       Python2.7
  handler:       map_function.main_handler
  memorySize:    128
  lastVersion:   $LATEST
  traffic:       1
  triggers: 
    cos: 
      - srcmr-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

11s › maprecude › Success

```
### 4. 调用
1）找到模版文档中的 test.txt 文件。

2）切换至[对象存储控制台](https://console.cloud.tencent.com/cos/bucket)，选择创建好的 Bucket：srcmr，单击【上传文件】。

3）在弹出的 “上传文件” 窗口中，选择 test.txt，单击【确定上传】。

4）切换至[云函数控制台](https://console.cloud.tencent.com/scf/list?rid=8&ns=default)，查看执行结果。在运行日志中可以看到打印出来的日志信息。

5）切换至 [对象存储控制台](https://console.cloud.tencent.com/cos/bucket)，选择创建好的 Bucket：destmr，查看生成的文件。

### 5. 移除

可以通过以下命令移除应用

```console
$ sls remove --all

serverless ⚡ framework

8s › maprecude › Success
  
```


