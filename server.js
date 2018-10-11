const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users=require('./routers/api/users');
const profile=require('./routers/api/profile');
const posts=require('./routers/api/posts');

const app=express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect db
mongoose
  .connect(db)
  .then(()=>console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);
//Use routes
app.use('/api/users', users);
app.use('/api/posts',posts);
app.use('/api/profile',profile);

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`Server running on port ${port}`));