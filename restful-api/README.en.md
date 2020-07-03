# Build a RESTful API

## Quick Start

Build a serverless REST API application with tencent serverless SCF component, support GET/PUT methods.

&nbsp;

- [请点击这里查看中文版部署文档](./README.md)

&nbsp;

1. [Install](#1-install)
2. [Configure](#2-configure)
3. [Deploy](#3-deploy)
4. [Test](#4-test)
5. [Remove](#5-remove)
6. [Account (optional)](#6-account-optional)

### 1. Install

**Install Serverless Framework**

```console
$ npm install -g serverless
```

### 2. Configure

Create a template in a new folder, with the following command

```console
$ serverless init -t restful-api
```

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

### 3. Deploy

Use `sls deploy` command to deploy your project, you could also add `--debug` to see the detail information in the process.

If you have a `Wechat` account, you don't need to configure the `.env` file, just scan the QR code in terminal and sign-up a new account of Tencent Cloud. It's a streamlined experience.

If you don't have a wechat account, you could jump to [account](#6-account-optional) step and configure the account info.

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

### 4. Test

Use the following command to test REST API and check the response:

```console
$ curl -XGET http://service-9t28e0tg-1250000000.gz.apigw.tencentcs.com/release/users/teacher/go

{"result": "it is student_get action"}
```

```console
$ curl -PUT http://service-9t28e0tg-1250000000.gz.apigw.tencentcs.com/release/users/student/go

{"result": "it is teacher_put action"}
```

### 5. Remove

Use the following command to remove the project

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

### 5. Account (optional)

Just create a `.env` file

```console
$ touch .env # your Tencent API Keys
```

Add the access keys of a [Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with `AdministratorAccess` in the `.env` file, using this format:

```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

- If you don't have a Tencent Cloud account, you could [sign up](https://intl.cloud.tencent.com/register) first.
