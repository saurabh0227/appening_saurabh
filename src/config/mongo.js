const mongoose = require('mongoose');
const config = require('./config');

const mongo_uri = config.mongo_uri;
mongoose.set('useCreateIndex', true);

module.exports = (async () => {
  try {
    await mongoose.connect(mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      // debug: true,
    });
    // listen for requests
    console.log(`MongoDB Conected to ${mongo_uri}`);
  } catch (err) {
    console.log(`${err} Could not Connect to the Database. Exiting Now...`);
    process.exit();
  }
})();
