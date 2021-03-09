const { MongoClient } = require('mongodb');

function myDB() {
  const myDB = {};
  const dbName = 'fileStorage';
  const uri = 'mongodb://localhost:27017';
  let client;

  myDB.queryUser = async (query = {}) => {
    try {
      console.log('query');
      console.log(query);
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db(dbName);
      const userCol = db.collection('users');
      console.log('before write');
      console.log(query);
      file = await userCol.findOne(query);
      console.log(file);
      return file;
    } finally {
      client.close();
    }
  };

  myDB.storeUser = async (user) => {
    try {
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db(dbName);
      const userCol = db.collection('users');
      console.log('before write');
      console.log(user);
      let result = await userCol.insertOne(user);
      return result;
    } catch (error) {
      return error;
    } finally {
      client.close();
    }
  };

  myDB.createFile = async (file) => {
    try {
      client = new MongoClient(uri);
      console.log('Connecting to the db');
      await client.connect();
      console.log('Connected!');
      const db = client.db(dbName);
      const filesCol = db.collection('files');
      console.log('Collection ready, insert ', file);
      const res = await filesCol.insertOne(file);
      console.log('Inserted', res);

      return res;
    } finally {
      console.log('Closing the connection');
      client.close();
    }
  };
  return myDB;
}

module.exports = myDB();
