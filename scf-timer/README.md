# Personal email reminder

This is a template for a personal email reminder. It uses a simple SCF function with a timer to automatically trigger the function at the specified time (cron job). When creating a timer trigger, you can customize the triggering time by using a standard cron expression. More documentation on cron expressions syntax and input parameters of time triggers can be found [here](https://intl.cloud.tencent.com/jp/document/product/583/9708?lang=jp). The SCF function makes use of [Nodemailer]([https://nodemailer.com/about/](https://nodemailer.com/about/)), a module for Node.js applications to easily send emails.

&nbsp;
1. [Prepare](#Prepare)
2. [Download](#Download)
3. [Bootstrap](#Bootstrap)
4. [Deploy](#Deploy)
5. [Development](#Development)
&nbsp;


### Prepare

Before all below steps, you should install [Serverless Framework](https://www.github.com/serverless/serverless) globally:

```bash
$ npm i serverless -g
```


### Download

Severless cli is very convenient, it can download templates in any github project which should contain `serverless.yml` file.

```bash
$ serverless init -t scf-timer
```


### Bootstrap

Create a  `.env` file in project root directory and add the access keys of a [Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with `AdministratorAccess` in the `.env` file, like below. You will also need to add your email address and password for the email to which the reminders will be sent.

```dotenv
# .env
# Add this line if you have a Tencent international account (Non-Mainland China users)
SERVERLESS_PLATFORM_VENDOR=tencent

# secret for credential
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# email account details
EMAIL_ADDRESS=john@outlook.com
EMAIL_ADDRESS_PASSWORD=password
```

You then need to download the "Nodemailer" module which is used in the main handler to send the email reminder.

 ```bash
$ npm i nodemailer
 ```

 ### Support commands

Deploy (you can use "--debug" parameter to see what is happening under the hood):

 ```bash
 $ sls deploy

serverless ⚡ framework


Action: "deploy" - Stage: "dev" - App: "personal-reminder" - Instance: "personal-reminder"


**functionName:** personal-reminder

**description:** trigger scf function based on timer

**namespace:** default

**runtime:** Nodejs8.9

**handler:** index.main_handler

**memorySize:** 128

**lastVersion:** $LATEST

**traffic:** 1

**triggers:**

	**timer:**

		- test-timer



Full details: https://serverless.cloud.tencent.com/apps/personal-reminder/personal-reminder/dev



26s › personal-reminder › Success
 ```

Remove:

```bash
$ sls remove

serverless ⚡ framework
Action: "remove" - Stage: "dev" - App: "meeting_bot" - Instance: "meeting_bot"

11s › personal-reminder › Success
```

### License

MIT
