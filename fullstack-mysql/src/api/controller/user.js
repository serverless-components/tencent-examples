'use strict';

const db = require('./db');

function ApiError(code, msg) {
  const e = new Error(msg);
  e.code = code;
  return e;
}

module.exports = {
  async getUserList() {
    const res = await db.query('SELECT * FROM users');
    return res[0];
  },
  async createUser(user) {
    const { name, email, site } = user;
    const existUser = await this.getUserByName(name);
    if (existUser) {
      throw new ApiError(1000, `Name ${name} exist.`);
    }
    const [res] = await db.query('INSERT INTO users SET ?', {
      name,
      email,
      site,
    });
    return {
      ...user,
      id: res.insertId,
    };
  },

  async getUserByName(name) {
    try {
      const [rows] = await db.query(`SELECT * FROM users WHERE ?`, { name });
      if (rows.length > 0) {
        return rows;
      }
      return false;
    } catch (e) {
      throw new ApiError(1001, e);
    }
  },

  async deleteUserByName(name) {
    const res = await db.query('DELETE FROM users WHERE name = ?', name);
    return res;
  },

  async deleteUserId(id) {
    const res = await db.query('DELETE FROM users WHERE id = ?', id);
    return res;
  },
};
