'use strict';
exports.index = async (event, context) => {
    return {
      msg: 'Hello Serverless',
    };
  };
  
  exports.list = async (event, context) => {
    return [
      {
        id: 1,
        name: 'test',
      },
    ];
  };
  
  exports.detail = async (event, context) => {
    return {
      id: 1,
      name: 'test',
    };
  };
  