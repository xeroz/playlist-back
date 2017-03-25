'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/back', (err, res) => {
   if(err){
      throw err;
   }else{
      console.log("la base de datos esta chida");
      app.listen(port, function(){
         console.log("servidor del api esta en el http://localhost:"+port);
      });
   }
})
