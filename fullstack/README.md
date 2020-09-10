# fullstack

## 操作场景

该模板可以快速部署一个基于 Vue + Express + PostgreSQL 的全栈 Serverless 应用。主
要包含以下组件：

- Serverless RESTful API：通过**云函数**和 **API 网关**构建的 Express 框架实现
  RESTful API。
- Serverless 静态网站：前端通过托管 Vue.js 静态页面到 **COS 对象存储**中。
- PostgreSQL Serverless：通过创建 **PostgreSQL DB** 为全栈网站提供数据库服务。
- VPC：通过创建 **VPC** 和 **子网**，提供 SCF 云函数和数据库的网络打通和使用。

## 前提条件

- 已安装 [Node.js](https://nodejs.org/en/)（Node.js 版本需不低于 8.6，建议使用
  Node.js10.0 及以上版本）

## 操作步骤

### 安装

通过 npm 全局安装
[Serverless Framework](https://github.com/serverless/serverless)：

```shell
$ npm install -g serverless
```

如果之前您已经安装过 Serverless Framework，可以通过下列命令升级到最新版：

```shell
$ npm update -g serverless
```

安装完毕后，通过运行 serverless -v 命令，查看 Serverless Framework 的版本信息，
确保版本信息不低于以下版本：

```shell
$ serverless –v
Framework Core: 1.67.3
Plugin: 3.6.6
SDK: 2.3.0
Components: 2.30.1
```

### 配置

1.新建一个本地文件夹，使用`sls init`命令，下载相关 template。

```bash
sls init -t fullstack
```

2.在项目模板中找到.env.example 文件，修改名称为.env，并在其中配置对应的腾讯云
SecretId 和 SecretKey 信息、地域可用区及子网等信息。

```text
# .env
TENCENT_SECRET_ID=xxx  # 您账号的SecretId
TENCENT_SECRET_KEY=xxx # 您账号的SecretKey

# 地域可用区配置
REGION=ap-beijing # 资源部署区，该项目中指云函数与静态页面部署区
ZONE=ap-beijing-3 # 资源部署可用区 ，该项目中指DB部署所在的可用区
```

> 说明：

- 如果没有腾讯云账号，请先 [注册新账号](https://cloud.tencent.com/register)。
- 如果已有腾讯云账号，请保证您的账号已经授权了 AdministratorAccess 权限。 您可以
  在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 SecretId
  和 SecretKey。
- ZONE 目前只支持 ap-beijing-3 、ap-guangzhou-2、ap-shanghai-2。
- 您可以在子网中获取 VPC_ID 和 SUBNET_ID，**请务必保证和 ZONE 在同一个可用区**。

  3.通过执行以下命令，安装所需依赖：

```bash
$ npm run bootstrap
```

### 部署

1.执行以下命令进行部署.

```bash
$ sls deploy --all

serverless ⚡ framework

serverlessVpc:
  region:     ap-guangzhou
  zone:       ap-guangzhou-2
  vpcId:      vpc-xxx
  vpcName:    serverless
  subnetId:   subnet-xxx
  subnetName: serverless

fullstackDB:
  region:         ap-guangzhou
  zone:           ap-guangzhou-2
  vpcConfig:
    subnetId: subnet-100000
    vpcId:    vpc-1000000
  dBInstanceName: fullstackDB
  dBInstanceId:   postgres-100000
  private:
    connectionString: postgresql://tencentdb_100000xxxxxxxxxxxxx@172.16.250.15:5432/tencentdb_1000000
    host:             172.16.250.15
    port:             5432
    user:             tencentdb_100000
    password:         xxxxxxxx
    dbname:           tencentdb_100000

fullstack-api:
  region: ap-guangzhou
  apigw:
    serviceId:   service-100000
    subDomain:   service-100000-123456789.gz.apigw.tencentcs.com
    environment: release
    url:         https://service-100000-123456789.gz.apigw.tencentcs.com/release/
  scf:
    functionName: fullstack-api
    runtime:      Nodejs10.15
    namespace:    default

fullstack-frontend:
  website: https://fullstack-serverless-db-123456789.cos-website.ap-guangzhou.myqcloud.com

50s › tencent-fullstack › Success
```

部署成功后，您可以使用浏览器访问项目产生的 website 链接，就可以看到生成的网站了
。

2.执行 npm run info 查看部署信息，该项目部署的信息分三部分：db、api、frontend（
前端网站）。

```bash
$ npm run info
> tencent-fullstack@1.1.0 info /root/tencent-fullstack
> npm run info:vpc && npm run info:db && npm run info:api && npm run info:frontend

> tencent-fullstack@1.1.0 info:vpc /Users/yugasun/Desktop/Develop/@yugasun/tencent-fullstack
> sls info --target=./vpc


serverless ⚡ framework

Status:       active
Last Action:  deploy (5 minutes ago)
Deployments:  1

region:     ap-guangzhou
zone:       ap-guangzhou-2
vpcId:      vpc-xxx
vpcName:    serverless
subnetId:   subnet-xxx
subnetName: serverless

serverlessVpc › Info successfully loaded


> tencent-fullstack@1.1.0 info:db /root/tencent-fullstack
> sls info --target=./db


serverless ⚡ framework

Status:       active
Last Action:  deploy (3 minutes ago)
Deployments:  18

region:         ap-guangzhou
zone:           ap-guangzhou-2
vpcConfig:
  subnetId: subnet-100000
  vpcId:    vpc-1000000
dBInstanceName: fullstackDB
dBInstanceId:   postgres-100000
private:
  connectionString: postgresql://tencentdb_100000xxxxxxxxxxxxxxxxxxx@172.16.250.15:5432/tencentdb_100000
  host:             172.16.250.15
  port:             5432
  user:             tencentdb_1000000
  password:         xxxxxxxxx
  dbname:           tencentdb_1000000

fullstackDB › Info successfully loaded


> tencent-fullstack@1.1.0 info:api /root/tencent-fullstack
> sls info --target=./api


serverless ⚡ framework

Status:       active
Last Action:  deploy (2 minutes ago)
Deployments:  10

region: ap-guangzhou
apigw:
  serviceId:   service-1000000
  subDomain:   service-1000000-123456789.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-1000000-123456789.gz.apigw.tencentcs.com/release/
scf:
  functionName: fullstack-api
  runtime:      Nodejs10.15
  namespace:    default

fullstack-api › Info successfully loaded


> tencent-fullstack@1.1.0 info:frontend /root/tencent-fullstack
> sls info --target=./frontend


serverless ⚡ framework

Status:       active
Last Action:  deploy (2 minutes ago)
Deployments:  9

website: https://fullstack-serverless-db-123456789.cos-website.ap-guangzhou.myqcloud.com

fullstack-frontend › Info successfully loaded
```

3.执行 sls remove --all，可移除项目。

```bash
$  sls remove --all

serverless ⚡ framework

38s › tencent-fullstack › Success
```
