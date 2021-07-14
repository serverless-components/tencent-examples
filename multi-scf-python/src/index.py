
def index(event, context):
  return {
    "message": 'Tencent SCF execute successful!',
    "input": event,
  }

def hello(event, context):
  name = event.get('pathParameters').get('name')
  body = event.get('body')
  queryString = event.get('queryString')

  return {
    "message": "Hello from " + name or 'Anonymous',
    "body": body or {},
    "queries": queryString or {},
  }