const { MongoClient } = require("mongodb");
const connectionString = "mongodb+srv://roleplay-io-server:O4thtdpU8HGlngV4@roleplay-io.suh1d.mongodb.net/Roleplay-io-db?retryWrites=true&w=majority";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("Roleplay-io-db");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};