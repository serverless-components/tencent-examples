'use strict';
exports.index = async (event, context) => {
  return {
    message: 'Tencent SCF execute successful!',
    input: event,
  };
};

exports.hello = async (event, context) => {
  const name = event.pathParameters.name
  return {
    message: `Hello from ${name || 'Anonymous'}`,
    body: event.body || null,
    queries: event.queryString || null,
  };
};