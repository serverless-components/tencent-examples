# Serverless OCR

Serverless OCR Application developed by Serverless Framework.

### Prepare

Before all below steps, you should install
[Serverless Framework](https://www.github.com/serverless/serverless) globally:

```bash
$ npm i serverless -g
```

### Init Project

Severless cli is very convenient, it can download templates in any github
project which should contain `serverless.yml` file.

```bash
$ serverless init -t ocr-app
```

### Bootstrap

Copy `.env.example` file to `.env` in project root:

Add the access keys of a
[Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with
`AdministratorAccess` in the `.env` file, like below:

```dotenv
# .env
TENCENT_APP_ID=xxx
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# region of bucket
REGION=ap-guangzhou
# bucket name, using to store upload pictures
BUCKET=ocr-images
```

Install the NPM dependencies:

```bash
$ npm run bootstrap
```

### Setup Bucket

You should create a bucket for storing user's uploaded images. By the way, this
bucket must config `CORS` headers, refer to:
https://cloud.tencent.com/document/product/436/13318

Below is a example for allow all `CORS` headers:

<center>
<img src="https://static-yugasun-com-1251556596.file.myqcloud.com/sls/cos-cors-setup.png" alt="CORS config" width="300">
</center>

### Development

Start server:

```bash
$ cd server && npm run start
```

Start frontend:

```bash
$ cd frontend && npm run start
```

Then you can access frontend page by http://localhost:3000.

### Support commands

Deploy:

```bash
$ npm run deploy
```

Get deploy info:

```bash
$ npm run info
```

Remove:

```bash
$ npm run remove
```

## License

MIT
