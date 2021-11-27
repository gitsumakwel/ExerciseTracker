const errorLog = (err) => { 
          console.log(err);
}
const mongoose = require('mongoose');
//const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGO_URI;
const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => { 
      //ready to use. The `mongoose.connect()` promise resolves to mongoose instance.
      //console.log("Successfully connected to MongoDB.");      
    },
    err => { 
      //handle initial connection error
      console.log("Error: ",err);
    }
);

mongoose.connection.on('error', err => {
  errorLog(err);
});

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');

    mongoose.connection.db.listCollections().toArray(function (err, names) {
        //console.log(names); //show collections
    });
});
mongoose.connection.on('disconnected', function (ref) {
    console.log('Disconnected to mongo server.');

});

module.exports = {
  connector
}