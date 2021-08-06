'use strict';

const { Pool } = require('pg');

let pgPool;

exports.index = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const getPool = async () => {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: process.env.PG_CONNECT_STRING,
      });
      // init table
      await pgPool.query(`CREATE TABLE IF NOT EXISTS todos (
      ID serial NOT NULL,
      TITLE           CHAR(40)         NOT NULL,
      NOTE            TEXT,         
      IS_COMPLETE     BOOLEAN             DEFAULT FALSE
    );`);
      return pgPool;
    } else {
      return pgPool;
    }
  };

  const pool = await getPool();
  const client = await pool.connect();
  const { rows } = await client.query({
    text: 'SELECT * FROM todos',
  });
  return {
    message: 'Tencent SCF execute successful!',
    data: rows,
  };
};

exports.hello = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const name = event.pathParameters.name;
  return {
    message: `Hello from ${name || 'Anonymous'}`,
    body: event.body || null,
    queries: event.queryString || null,
  };
};
