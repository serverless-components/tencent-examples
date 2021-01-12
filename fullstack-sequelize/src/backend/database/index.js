const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db');
const { initUser, User } = require('../models/user');

function isUnknowDatabaseError(msg) {
  return msg.indexOf('Unknown database') !== -1;
}

async function syncTables(sequelize) {
  initUser(sequelize);

  await sequelize.sync({ force: true, hooks: true });
}

async function initTestData() {
  await User.truncate();
  await User.create({
    name: 'test',
    email: 'test@test.com',
    site: 'test.com',
  });
}

const initDatabase = async () => {
  if (!global.sequelize) {
    const { database } = dbConfig;
    const sequelizeConfig = {
      logging: true,
      dialect: 'mysql',
      ...dbConfig,
      pool: {
        // 连接池中最小链接数
        min: 1,
        // 链接池中最大链接数
        max: 5,
        // 连接最大空闲时间为 10 分钟，超过将自动释放
        idle: 600000,
      },
    };
    let sequelize;
    // 初始化数据库
    try {
      sequelize = new Sequelize(sequelizeConfig);

      await syncTables(sequelize);
    } catch (e) {
      console.log('e.message', e.message);
      // 如果报错数据库不存在，就尝试重新创建
      // 如果其他链接错误，就直接抛错
      if (isUnknowDatabaseError(e.message)) {
        console.log(`Trying to create database ${database}`);
        delete sequelizeConfig.database;
        sequelize = new Sequelize(sequelizeConfig);

        await sequelize.query(`create database if not exists ${database};`);
        await sequelize.close();

        sequelize = new Sequelize({
          ...sequelizeConfig,
          ...{
            database,
          },
        });

        await syncTables(sequelize);
      } else {
        throw e;
      }
    }

    await initTestData();

    global.sequelize = sequelize;

    return global.sequelize;
  } else {
    return global.sequelize;
  }
};

module.exports = {
  initDatabase,
};
