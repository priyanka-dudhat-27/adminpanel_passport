const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1/adminBlog');
const db=mongoose.connection;

db.once('open',function(err){
    (err)?console.log('something wrong in database connection'):console.log('db is connected')
})

module.exports=db;