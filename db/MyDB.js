const { MongoClient } = require("mongodb");

function myDB() {
  const myDB = {};
  const dbName = "fileStorage";
  const uri =
    "mongodb+srv://wzy:123456wzy@cluster0.jroge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  let client;

  myDB.queryUser = async (query = {}) => {
    try {
      console.log("query");
      console.log(query);
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db(dbName);
      const userCol = db.collection("users");
      console.log("before write");
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
      const userCol = db.collection("users");
      console.log("before write");
      console.log(user);
      let result = await userCol.insertOne(user);
      return result;
    } catch (error) {
      return error;
    } finally {
      client.close();
    }
  };
  return myDB;
}

module.exports = myDB();
