# fullstack

This is a template of serverless fullstack application. It aims to be the
simplest possible way to build a serverless fullstack application, including a
Vue.js application on the front-end bundled with Parcel and back-end API using
postgresql.

This template includes:

- **Serverless RESTful API**: Using
  [@serverless/tencent-express](https://github.com/serverless-components/tencent-express/tree/v2)
  component, it contains a Servelress Cloud Function and a single API Gateway
  endpoint.

- **Serverless website using Vue.js**:
  [@serverless/tencent-website](https://github.com/serverless-components/tencent-website/tree/v2),
  it deploys all static files to Cloud Object Storage.

- **Serverless Postgresql**:
  [@serverless/tencent-postgresql](https://github.com/serverless-components/tencent-postgresql/tree/v2),
  it auto create a postgresql database for backend using.

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
$ serverless create --template-url https://github.com/serverless-components/tencent-fullstack
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
VPC_ID=vpc-xxx
SUBNET_ID=subnet-xxx
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

Get deploy info:

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
  url:         https://service-100000-123456789.gz.apigw.tencentcs.com/release/
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

Remove:

```bash
$ sls remove --all

serverless ⚡ framework

38s › tencent-fullstack › Success
```

### License

MIT

```

```
