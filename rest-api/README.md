# 快速构建 REST API

## 简介

REST API 模板使用 Tencent SCF 组件及其触发器能力，方便的在腾讯云创建，配置和管理一个 REST API 应用。

## 快速开始

通过 Serverless SCF 组件快速构建一个 REST API 应用，实现 GET/PUT 操作。

&nbsp;

- [Check out the English version tutorial here.](./README_EN.md)

&nbsp;

1. [安装](#1-安装)
2. [配置](#2-配置)
3. [部署](#3-部署)
4. [测试](#4-测试)
5. [移除](#5-移除)

&nbsp;

### 1. 安装

**安装 Serverless Framework**

```console
$ npm install -g serverless
```

### 2. 配置

通过如下命令直接下载该例子：

```
serverless init -t rest-api
```

查看 src/index.py 代码，可以看到接口的传参和返回逻辑：

```python
# -*- coding: utf8 -*-

def teacher_go():
    # todo: teacher_go action
    return {
        "result": "it is student_get action"
    }

def student_go():
    # todo: student_go action
    return {
        "result": "it is teacher_put action"
    }

def student_come():
    # todo: student_come action
    return {
        "result": "it is teacher_put action"
    }

def main_handler(event, context):
    print(str(event))
    if event["pathParameters"]["user_type"] == "teacher":
        if event["pathParameters"]["action"] == "go":
            return teacher_go()
    if event["pathParameters"]["user_type"] == "student":
        if event["pathParameters"]["action"] == "go":
            return student_go()
        if event["pathParameters"]["action"] == "come":
            return student_come()
```

### 3. 部署

通过`sls deploy`命令进行部署，并可以添加`--debug`参数查看部署过程中的信息

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过`微信`扫描命令行中的二维码进行授权登陆和注册。

```text
$ serverless deploy

serverless ⚡ framework
Action: "deploy" - Stage: "dev" - App: "scfApp" - Instance: "apidemo"

functionName: myRestAPI
description:  My Serverless Function
namespace:    default
runtime:      Python3.6
handler:      index.main_handler
memorySize:   128
lastVersion:  $LATEST
traffic:      1
triggers: 
  apigw: 
    - http://service-6uku1298-000000000.gz.apigw.tencentcs.com/release/users/{user_type}/{action}

Full details: https://serverless.cloud.tencent.com/instances/scfApp%3Adev%3Aapidemo

28s › apidemo › Success


```

### 4. 测试

通过如下命令测试 REST API 的返回情况：

> 注：如 windows 系统中未安装`curl`，也可以直接通过浏览器打开对应链接查看返回情况

```console
$ curl -XGET http://service-9t28e0tg-1250000000.gz.apigw.tencentcs.com/release/users/teacher/go

{"result": "it is student_get action"}
```

```console
$ curl -PUT http://service-9t28e0tg-1250000000.gz.apigw.tencentcs.com/release/users/student/go

{"result": "it is teacher_put action"}
```

### 5. 移除

可以通过以下命令移除 REST API 应用

```console
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removing any previously deployed API. api-37gk3l8q
  DEBUG ─ Removing any previously deployed service. service-9t28e0tg
  DEBUG ─ Removing function
  DEBUG ─ Request id
  DEBUG ─ Removed function myRestAPI successful

  7s » myRestAPI » done
```

### 账号配置（可选）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件

```console
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
