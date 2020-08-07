import os
import json
import urllib.request


def send_data (wechat_data, wechat_url, slack_data, slack_url):
    wechat_data = json.dumps(wechat_data).encode("utf-8")
    wechat_req_attr = urllib.request.Request(wechat_url, wechat_data)
    wechat_resp_attr = urllib.request.urlopen(wechat_req_attr)

    slack_data = json.dumps(slack_data).encode("utf-8")
    slack_req_attr = urllib.request.Request(slack_url, slack_data)
    slack_resp_attr = urllib.request.urlopen(slack_req_attr)

    return [wechat_resp_attr.read().decode("utf-8"), slack_resp_attr.read().decode("utf-8")]

def format_wechat_data (content):
    formatted_wechat_data = {
        "msgtype": "text",
        "text": {
            "content": content
        }
    }
    return formatted_wechat_data

def format_slack_data (content):
    formatted_slack_data = {
        "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": content,
            }
        }]
    }
    return formatted_slack_data

def main_handler (event, context):
    wechat_url = os.environ.get("wechat_url")
    slack_url = os.environ.get("slack_url")

    # For Timer Trigger events
    if "Type" in event:

        if event["TriggerName"] == "daily_meeting":
            content = "This is a daily meeting reminder for every day at 10:00am."
            wechat_data = format_wechat_data(content)
            slack_data = format_slack_data(content)
            send_data(wechat_data, wechat_url, slack_data, slack_url)

        elif event["TriggerName"] == "weekly_meeting":
            content = "This is a weekly meeting reminder for every Monday at noon."
            wechat_data = format_wechat_data(content)
            slack_data = format_slack_data(content)
            send_data(wechat_data, wechat_url, slack_data, slack_url)
    # For apigw events
    else:
        if event["path"] == "/spontaneous_meeting":
            content = "This is a spontaneous meeting reminder."
            query_data = event["queryString"]
            if len(query_data) > 0:
                content += "\n" + str(query_data["info"])
            wechat_data = format_wechat_data(content)
            slack_data = format_slack_data(content)
            send_data(wechat_data, wechat_url, slack_data, slack_url)
