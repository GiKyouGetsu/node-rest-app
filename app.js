const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')

const productRoutes = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')
const app = express();


// mongo DB config
const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1/retail';
mongoose.connect(DB_URL
    ,{
        useNewUrlParser:true,
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
    }
)
mongoose.promise = global.promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error'));
db.on('connected', res => console.log('Connected URL：' + DB_URL));
db.once('open', function(){
    console.log('DB Open Callback')
})
db.on('disconnected', () => console.log('Mongoose connection disconnected URL: ' + DB_URL))

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.use('/products', productRoutes)
app.use('/orders', orderRouter)
app.use("/user", userRoutes);


app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;