/* eslint-disable prettier/prettier */
//* This line adds 'requireFromRoot' to global object and makes it usable from anywhere in the code
const express = require('express');

const cors = require('cors');

const app = express();
const corsOptions = {
    exposedHeaders: 'Content-Range',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

app.get('/api/whoami', (req, res) => {
    const ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const language = req.headers["accept-language"].split(',')[0];
    const software = req.headers['user-agent'].split(') ')[0].split(' (')[1];
    res.json({ ipaddress, language, software });
  });
  

app.use('/api', (req, res, next) => {
    const formattedDate = convertDate();
    return res.status(200).json(formattedDate);        
});

app.listen(4123, () => {
    console.log(`Listening to port 4123`);
});

module.exports = app;
