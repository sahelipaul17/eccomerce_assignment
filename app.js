const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const fs = require('fs');

const path = require('path');

const morgan = require('morgan');

const mongoose = require('mongoose');

const session = require('express-session');
// const expressValidator=require('express-validator');
const fileUpload = require('express-fileupload');

const passport = require('passport');

// const message = require('express-messages');

app.locals.errors = null;

const cookieParser = require('cookie-parser');

require('dotenv/config');

const api = process.env.API_URL;

// mongodb connection
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Hurhhh!!Connected!'))
  .catch((err) => console.log('Opss!!Not able connect', err));

// log file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(morgan('tiny'))
app.use(morgan('combined', { stream: accessLogStream }));

// cookie-parser
app.use(cookieParser());

// express fileupload middleware
app.use(fileUpload());

// express-message
// app.use((req, res, next) => {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

// passport config
require('./config/passport')(passport);
// passport
app.use(passport.initialize());
app.use(passport.session());

app.get('*', async (req, res, next) => {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});

// express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

// express messages
app.use(require('connect-flash')());

// app.use((req, res, next) => {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

// api/v1
// set routes
const products = require('./routes/product.route');
const cart = require('./routes/cart.route');
const users = require('./routes/user.route');
const adminCategories = require('./routes/admin_category.route');
const adminProducts = require('./routes/admin_products.route');

app.use(`${api}/admin/categories`, adminCategories);
app.use(`${api}/admin/products`, adminProducts);
app.use(`${api}/products`, products);
app.use(`${api}/cart`, cart);
app.use(`${api}/users`, users);

// server
app.listen(3000, () => {
  console.log(api);
  console.log('server is running on localhost 3000');
});
