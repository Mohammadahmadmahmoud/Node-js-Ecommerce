const express = require("express")
const app = express()
const port = 5000
// const db = require('./config/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
//const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/products');
let db = mongoose.connection;
// check connection
db.once('open', (req,res) =>{
    console.log('Connected to database');
});
// connection error 
db.on('error', (err) => {
    console.log(err);
});

// Setup ejs template

app.set('view engine', 'ejs')
// Setup body parser 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Handle with  static

app.use(express.static('public'))
app.use(express.static('uploads'))
 
// session and flash config .
app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app.use(flash())
// bring passport 
app.use(passport.initialize())
app.use(passport.session())
//store user object 

app.get('*', (req,res,next)=> {
    res.locals.user = req.user || null
    next()
})

app.get('/', (req,res)=> {

   res.redirect('/products')
    
})

// Getting prducts routes

const products = require('./routes/product-routes')
app.use('/products', products)

// Getting  user routes
const users = require('./routes/user-routes')
app.use('/users', users)

// listen to port 5000

app.listen(  ()=> {

    console.log(`http://localhost:${port}`)
})