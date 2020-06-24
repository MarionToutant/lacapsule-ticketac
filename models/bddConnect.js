const mongoose= require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: false
   };

mongoose.connect(`${process.env.MONGODB_URI}`,
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Ticketac connection : Success ***');
    }
   }
);

module.exports = mongoose;