const mongoose = require("mongoose");

module.exports = {
  init: () =>{
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiendTopology: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    };
    mongoose.connect("",dbOptions)
    mongoose.set('useFindAndModify',false);
    mongoose.Promise = global.Promise;
    mongoose.connection.on('connected',()=>{
      console.log('mongoose connected!')
    })
    mongoose.connection.on('err',err=>{
      console.error(`Error:\n${err.stack}`)
    })
    mongoose.connection.on('disconnected',()=>{
      console.warn('mongoose lost');
    })

  }
}