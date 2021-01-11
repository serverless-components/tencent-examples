'use strict';

const { User } = require('../models/user');

function ApiError(code, msg) {
  const e = new Error(msg);
  e.code = code;
  return e;
}

module.exports = {
  async getUserList() {
    const res = await User.findAll({});
    return res;
  },
  async createUser(user) {
    const { name } = user;
    const existUser = await this.getUserByName(name);
    if (existUser) {
      throw new ApiError(1000, `Name ${name} exist.`);
    }
    const res = await User.create(user);
    return res;
  },

  async getUserByName(name) {
    try {
      const res = await User.findOne({ where: { name } });
      if (res) {
        return res;
      }
      return false;
    } catch (e) {
      throw new ApiError(1001, e);
    }
  },

  async deleteUserByName(name) {
    const res = await User.destroy({ where: { name } });
    return res;
  },

  async deleteUserId(id) {
    const res = await User.destroy({ where: { id } });
    return res;
  },
};
