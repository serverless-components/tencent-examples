# WeChat Work and Slack bot template

This is a template for a WeChat and Slack bot that can be used to send daily, weekly,
or spontaneous reminders for meetings. It uses webhook principles to send notifications
to the apps.

It uses a simple SCF function with a timer to automatically trigger the function
at the specified time (cron job). When creating a timer trigger, you can customize
the triggering time by using a standard cron expression. More documentation on cron expressions
syntax and input parameters of time triggers can be found
[here](https://intl.cloud.tencent.com/jp/document/product/583/9708?lang=jp).

The SCF function also has an api gateway url through which spontaneous meetings
can be scheduled. Details for the meeting can be added via a query string parameter
"info", for example
https://service-xxx.gz.apigw.tencentcs.com/release/spontaneous_meeting?info=organized%20by%20Jason


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
$ serverless init -t bot-template
```


### Bootstrap

Copy `.env.example` file to `.env` in project root:

Add the access keys of a
[Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with
`AdministratorAccess` in the `.env` file, like below:

```dotenv
# .env
# Add this line if you have a Tencent international account (Non-Mainland China users)
SERVERLESS_PLATFORM_VENDOR=tencent

# secret for credential
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# global config
REGION=ap-guangzhou

# webhooks for wechat and slack bot
WEBHOOK1=https://qyapi.weixin.qq.com/xxx
WEBHOOK2=https://hooks.slack.com/xxx
```

For WeChat Work, you can simply add a "Group Robot" to a WeChat group, then copy
the Webhook URL link and add it to "WEBHOOK1" in your .env file.

For Slack, you can follow the steps [here](https://slack.com/help/articles/115005265703-Create-a-bot-for-your-workspace)
 to add a bot to a channel. Similarly, copy the Webhook URL link and add it to
 "WEBHOOK2" in your .env file.


You also need to download the "urllib" Python library which is used in the main handler
 to open and read urls.

 ```bash
$ pip install urllib3
 ```

 ### Support commands

 Deploy (you can use "--debug" parameter to see what is happening under the hood):

 ```bash
 $ sls deploy

serverless ⚡ framework
Action: "deploy" - Stage: "dev" - App: "meeting_bot" - Instance: "meeting_bot"

functionName: meeting_bot
description:  sends regular/spontaneous reminders for meetings
namespace:    default
runtime:      Python3.6
handler:      index.main_handler
memorySize:   64
lastVersion:  $LATEST
traffic:      1
triggers:
  apigw:
    - https://service-xxx.gz.apigw.tencentcs.com/release/spontaneous_meeting
  timer:
    - daily_meeting
    - weekly_meeting

Full details: https://serverless.cloud.tencent.com/instances/meeting_bot%3Adev%3Ameeting_bot
 ```

Remove:

```bash
$ sls remove

serverless ⚡ framework
Action: "remove" - Stage: "dev" - App: "meeting_bot" - Instance: "meeting_bot"

9s › meeting_bot › Success
```

### License

MIT
