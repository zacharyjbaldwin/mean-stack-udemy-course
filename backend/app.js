const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const postsRoutes = require('./routes/posts');

mongoose.connect('mongodb+srv://zachary:EnTeQeMWnteJmGd1@cluster0.lxlon3n.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB.');
  })
  .catch(() => {
    console.log('The connected to MongoDB failed.');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ urlencoded: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Wish, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
