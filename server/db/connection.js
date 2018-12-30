const mongoose    = require('mongoose');
// const color_logger = require('../utils/color_logger');
// const p = color_logger('connection.js');


// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

  const {DB_HOST, DB_PORT, DB_NAME} = process.env

// const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
const uri = 'mongodb://tomfr:ortaltom1@ds145434.mlab.com:45434/tomfr'

const connect = async ()=> {
    try{
        await mongoose.connect(uri, options)
        console.log('✨ Connected to Mongo DB ✨')
    }catch(error){
        console.log(error)
    }
}


// mongoose.connect(`mongodb://${API_HOST}/api-mongoose`,options)
//     .then(()=> console.log('MONGOOSE CONNECTION ESTABLISHED'))
//     .catch(err=> console.log(err));

module.exports = {connect};

