/* eslint-disable prettier/prettier */
//* This line adds 'requireFromRoot' to global object and makes it usable from anywhere in the code
const express = require('express');
const url = require('url');
const shortid = require('shortid');
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

const urlDb = {};


app.post('/api/shorturl', (req, res, next) => {
    const { url } = req.body;
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }
  
    const shortUrl = shortid.generate();
    urlDb[shortUrl] = url;
    res.json({ original_url: url, short_url: shortUrl });
  });
  
  app.get('/api/shorturl/:shortUrl', (req, res, next) => {
    const { shortUrl } = req.params;
    if (!urlDb[shortUrl]) {
      return res.json({ error: 'invalid url' });
    }
    console.log(urlDb[shortUrl])
    res.status(301).set('Location', urlDb[shortUrl]).send();
  });
app.listen(4123, () => {
    console.log(`Listening to port 4123`);
});

module.exports = app;
