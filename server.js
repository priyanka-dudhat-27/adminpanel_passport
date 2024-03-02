const express=require('express');
const port=8001;
const app=express();
const path=require('path')
const db=require('./config/mongoose')
const passport=require('passport');
const passportLocal=require('./config/passport-local')
const session=require('express-session')
const connectFlash=require('connect-flash');
const customFlash=require('./config/customFlash')

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname,'assets')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))


app.use(session({
    name:'RnW',
    secret:"akshar",
    resave:true,
    saveUninitialized: true,
    cookie: { maxAge: 1000*100*60}
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuth);

app.use(connectFlash());
app.use(customFlash.setFlash);

app.use('/',require('./router'))

app.listen(port,function(err){
    (err)?console.log('something wrong'):console.log('server is running on port',port)
})