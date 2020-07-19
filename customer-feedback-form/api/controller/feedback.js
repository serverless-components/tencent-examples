'use strict';

const { Pool } = require('pg');

let pgPool;

module.exports = {
  async getPool() {
    if (!pgPool) {
      pgPool = new Pool({
        connectionString: process.env.PG_CONNECT_STRING,
      });
      // init table
      await pgPool.query(`CREATE TABLE IF NOT EXISTS users (
        ID serial NOT NULL,
        NAME           TEXT         NOT NULL,
        EMAIL          CHAR(50)     NOT NULL,
        FEEDBACK       TEXT         NOT NULL
      );`);
      return pgPool;
    } else {
      return pgPool;
    }
  },

  async createUserFeedbackForm(user) {
    const pool = await this.getPool();
    const { name, email, feedback } = user;
    const client = await pool.connect();
    const { rowCount } = await client.query({
      text: 'INSERT INTO users(name, email, feedback) VALUES($1, $2, $3)',
      values: [name, email, feedback],
    });
    await client.end();
    console.log("Inserted data into database")
    return rowCount === 1;
  },
};
