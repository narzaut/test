/* eslint-disable prettier/prettier */
//* This line adds 'requireFromRoot' to global object and makes it usable from anywhere in the code
const express = require('express');
const dns = require('dns');

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
let urlIndex = 1;
const urlMap = new Map();

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  const host = new URL(url).host;

  dns.lookup(host, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    urlMap.set(urlIndex, url);
    res.json({ original_url: url, short_url: urlIndex });
    urlIndex++;
  });
});

app.get('/api/shorturl/:index', (req, res) => {
  const { index } = req.params;
  const originalUrl = urlMap.get(index);

  if (!originalUrl) {
    return res.json({ error: 'invalid short url' });
  }

  res.redirect(originalUrl);
});

app.listen(4123, () => {
    console.log(`Listening to port 4123`);
});

module.exports = app;
