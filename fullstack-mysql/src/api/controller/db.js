const { createPool } = require('mysql2/promise');

global.mysqlPool;

const initialize = async () => {
  if (!global.mysqlPool) {
    global.mysqlPool = await createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    // 初始化数据库
    await global.mysqlPool.query(`CREATE DATABASE IF NOT EXISTS fullstack;`);
    await global.mysqlPool.query(`USE fullstack;`);

    // 初始化表格
    await global.mysqlPool.query(`CREATE TABLE IF NOT EXISTS users(
      id     INT UNSIGNED AUTO_INCREMENT COMMENT 'primary key',
      name   VARCHAR(30) DEFAULT NULL,
      email  VARCHAR(50) DEFAULT NULL,
      site   VARCHAR(50) DEFAULT NULL,
      PRIMARY KEY (id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;`);
    return global.mysqlPool;
  } else {
    return global.mysqlPool;
  }
};

async function query(sql, values) {
  const pool = await initialize();
  const cmdSql = pool.format(sql, values);
  console.log(`[Query]: ${cmdSql}`);
  return pool.query(cmdSql);
}

module.exports = {
  initialize,
  query,
};
