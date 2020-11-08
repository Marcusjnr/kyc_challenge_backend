const functions = require('firebase-functions');
const express = require('express');
const authenticationRoute = require('./routes/authentication_route');
const validationRoute = require('./routes/validation_route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authenticationRoute);
app.use(validationRoute);
const api = functions.https.onRequest(app);
module.exports = { api };

