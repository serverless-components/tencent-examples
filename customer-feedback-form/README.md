# customer feedback app

This is a template of a typical customer feedback full-stack app coupled with database. When the customer submits the feedback form on the website, the information is stored in a postgresql database and is also sent by email to the merchant via nodemailer module built as a Serverless Cloud Function.

This template includes:

- **Serverless VPC (Virtual Private Cloud)**: Using
  [@serverless/tencent-express](https://github.com/serverless-components/tencent-vpc/tree/v2)
  component, it runs the app in an independent network space in Tencent Cloud and allows you to customize network segment classification, IP addresses, and routing policies.

- **Serverless RESTful API**: Using
  [@serverless/tencent-express](https://github.com/serverless-components/tencent-express/tree/v2)
  component, it contains a Serverless Cloud Function and a single API Gateway
  endpoint.

- **Serverless website (frontend) using HMTL, CSS and JavaScript**: Using
  [@serverless/tencent-website](https://github.com/serverless-components/tencent-website/tree/v2),
  it deploys all static files to Cloud Object Storage.

- **Serverless Postgresql**: Using
  [@serverless/tencent-postgresql](https://github.com/serverless-components/tencent-postgresql/tree/v2),
  it auto creates a postgresql database for backend use.

- **Serverless SCF (Serverless Cloud Function)**: Using
  [@serverless/tencent-scf](https://github.com/serverless-components/tencent-scf/tree/v2/),
  it provides a serverless execution environment for the code used to send emails using nodemailer library.


&nbsp;

1. [Prepare](#Prepare)
2. [Download](#Download)
3. [Bootstrap](#Bootstrap)
4. [Deploy](#Deploy)
5. [Development](#Development)

&nbsp;

### Prepare

Before all below steps, you should install
[Serverless Framework](https://www.github.com/serverless/serverless) globally:

```bash
$ npm i serverless -g
```

### Download

Severless cli is very convenient, it can download templates in any github
project which should contain `serverless.yml` file.

```bash
$ serverless init -t customer-feedback-app
```

### Bootstrap

Copy `.env.example` file to `.env` in project root:

Add the access keys of a
[Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with
`AdministratorAccess` in the `.env` file, like below:

```dotenv
# .env
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# change to your requirement
REGION=ap-guangzhou
ZONE=ap-guangzhou-2
```

Install the NPM dependencies:

```bash
$ npm run bootstrap
```

### Support commands

Deploy:

```bash
$ sls deploy --all

serverless ⚡ framework

customer-feedback-form-vpc:
  region:        ap-guangzhou
  zone:          ap-guangzhou-2
  vpcId:         vpc-xxx
  vpcName:       serverless
  subnetId:      subnet-xxx
  subnetName:    serverless
  vendorMessage: null

customer-feedback-form-db:
  region:         ap-guangzhou
  zone:           ap-guangzhou-2
  vpcConfig:
    subnetId: subnet-xxx
    vpcId:    vpc-xxx
  dBInstanceName: customer-feedback-form-db
  private:
    connectionString: postgresql://tencentdb_xxx
    host:             10.0.0.4
    port:             5432
    user:             xxx
    password:         xxx
    dbname:           tencentdb_xxx
  public:
    connectionString: postgresql://tencentdb_xxx
    host:             postgres-xxx.sql.tencentcdb.com
    port:             53518
    user:             tencentdb_xxx
    password:         xxx
    dbname:           tencentdb_xxx
  vendorMessage:  null

customer-feedback-form-nodemailer:
  functionName:  scf_component_xxx
  description:   Created by Serverless Component
  namespace:     default
  runtime:       Nodejs10.15
  handler:       index.main_handler
  memorySize:    128
  lastVersion:   $LATEST
  traffic:       1
  triggers:
    apigw:
      - https://service-xxx.gz.apigw.tencentcs.com/release/email
  vendorMessage: null

customer-feedback-form-api:
  region:        ap-guangzhou
  apigw:
    serviceId:   service-xxx
    subDomain:   service-xxx-xxx.gz.apigw.tencentcs.com
    environment: release
    url:         https://service-xxx-xxx.gz.apigw.tencentcs.com/release/
  scf:
    functionName: customer-feedback-form-api
    runtime:      Nodejs10.15
    namespace:    default
    lastVersion:  $LATEST
    traffic:      1
  vendorMessage: null

customer-feedback-form-website:
  region:        ap-guangzhou
  website:       http://customer-feedback-form-website-bucket-1xxx.cos-website.ap-guangzhou.myqcloud.com
  vendorMessage: null

91s › customer-feedback-form › Success
```

Get deploy info:

```bash
$ npm run info
> tencent-customer-feedback-app@1.1.0 info /Users/jasonahchuen/Desktop/Tencent/templates/customer-feedback-form
> npm run info:vpc && npm run info:database && npm run info:api && npm run info:feedback-form-website && npm run info:nodemailer


> tencent-customer-feedback-app@1.1.0 info:vpc /Users/jasonahchuen/Desktop/Tencent/templates/customer-feedback-form
> sls info --target=./vpc


serverless ⚡ framework


Last Action:  deploy (4 minutes ago)
Deployments:  10
Status:       active
More Info:    Full details: https://serverless.cloud.tencent.com/instances/customer-feedback-form%3Adev%3Acustomer-feedback-form-vpc

region:     ap-guangzhou
zone:       ap-guangzhou-2
vpcId:      vpc-xxx
vpcName:    serverless
subnetId:   subnet-xxx
subnetName: serverless

customer-feedback-form-vpc › Info successfully loaded


> tencent-customer-feedback-app@1.1.0 info:database /Users/jasonahchuen/Desktop/Tencent/templates/customer-feedback-form
> sls info --target=./database


serverless ⚡ framework


Last Action:  deploy (3 minutes ago)
Deployments:  10
Status:       active
More Info:    Full details: https://serverless.cloud.tencent.com/instances/customer-feedback-form%3Adev%3Acustomer-feedback-form-db

region:         ap-guangzhou
zone:           ap-guangzhou-2
vpcConfig:
  subnetId: subnet-xxx
  vpcId:    vpc-xxx
dBInstanceName: customer-feedback-form-db
private:
  connectionString: postgresql://tencentdb_xxx
  host:             10.0.0.4
  port:             5432
  user:             xxx
  password:         xxx
  dbname:           tencentdb_xxx
public:
  connectionString: postgresql://tencentdb_xxx
  host:             postgres-xxx.sql.tencentcdb.com
  port:             53518
  user:             xxx
  password:         xxx
  dbname:           tencentdb_xxx

customer-feedback-form-db › Info successfully loaded


> tencent-customer-feedback-app@1.1.0 info:api /Users/jasonahchuen/Desktop/Tencent/templates/customer-feedback-form
> sls info --target=./api


serverless ⚡ framework


Last Action:  deploy (3 minutes ago)
Deployments:  10
Status:       active
More Info:    Full details: https://serverless.cloud.tencent.com/instances/customer-feedback-form%3Adev%3Acustomer-feedback-form-api

region: ap-guangzhou
apigw:
  serviceId:   service-xxx
  subDomain:   service-xxx-xxx.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-xxx-xxx.gz.apigw.tencentcs.com/release/
scf:
  functionName: customer-feedback-form-api
  runtime:      Nodejs10.15
  namespace:    default
  lastVersion:  $LATEST
  traffic:      1

customer-feedback-form-api › Info successfully loaded


> tencent-customer-feedback-app@1.1.0 info:feedback-form-website /Users/jasonahchuen/Desktop/Tencent/templates/customer-feedback-form
> sls info --target=./feedback-form-website


serverless ⚡ framework


Last Action:  deploy (3 minutes ago)
Deployments:  10
Status:       active
More Info:    Full details: https://serverless.cloud.tencent.com/instances/customer-feedback-form%3Adev%3Acustomer-feedback-form-website

region:  ap-guangzhou
website: http://customer-feedback-form-website-bucket-xxx.cos-website.ap-guangzhou.myqcloud.com

customer-feedback-form-website › Info successfully loaded


> tencent-customer-feedback-app@1.1.0 info:nodemailer /Users/jasonahchuen/Desktop/Tencent/templates/customer-feedback-form
> sls info --target=./nodemailer


serverless ⚡ framework


Last Action:  deploy (4 minutes ago)
Deployments:  10
Status:       active
More Info:    Full details: https://serverless.cloud.tencent.com/instances/customer-feedback-form%3Adev%3Acustomer-feedback-form-nodemailer

functionName: scf_component_xxx
description:  Created by Serverless Component
namespace:    default
runtime:      Nodejs10.15
handler:      index.main_handler
memorySize:   128
lastVersion:  $LATEST
traffic:      1
triggers:
  apigw:
    - https://service-xxx-xxx.gz.apigw.tencentcs.com/release/email

customer-feedback-form-nodemailer › Info successfully loaded
```

Remove:

```bash
$ sls remove --all

serverless ⚡ framework

38s › customer-feedback-form › Success
```

### License

MIT
