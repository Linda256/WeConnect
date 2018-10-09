const express = require('express');
const mongoose = require('mongoose');

const app=express();
const users=require('./routers/api/users');
const profile=require('./routers/api/profile');
const posts=require('./routers/api/posts');

//DB config
const db = require('./config/keys').mongoURI;

//Connect db
mongoose
  .connect(db)
  .then(()=>console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/',(req,res) => res.send('Hello Linda'));

//Use routes
app.use('/api/users', users);
app.use('/api/posts',posts);
app.use('/api/profile',profile);

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`Server running on port ${port}`));