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

const users = {};

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const _id = Date.now().toString();
  users[_id] = { username, _id, log: [] };
  res.json({ username, _id });
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

app.post('/api/users/:_id/exercises', (req, res) => {
    const { _id } = req.params;
    const { description, duration } = req.body;
    const date = new Date().toDateString();
    if (!users[_id]) {
      return res.status(404).json({ message: 'User not found' });
    }
    const exercise = { description, duration: parseFloat(duration), date };
    users[_id].log.push(exercise);
    res.json(users[_id]);
  });

  app.get('/api/users/:_id/logs', (req, res) => {
    const { _id } = req.params;
    if (!users[_id]) {
      return res.status(404).json({ message: 'User not found' });
    }
    let logs = users[_id].log;
    const { from, to, limit } = req.query;
    if (from || to) {
      logs = logs.filter(log => {
        const logDate = new Date(log.date);
        if (from && to) {
          return logDate >= new Date(from) && logDate <= new Date(to);
        } else if (from) {
          return logDate >= new Date(from);
        } else {
          return logDate <= new Date(to);
        }
      });
    }
    if (limit) {
      logs = logs.slice(0, parseInt(limit));
    }
    res.json({
      username: users[_id].username,
      count: logs.length,
      _id: users[_id]._id,
      log: logs
    });
  });

app.listen(4123, () => {
    console.log(`Listening to port 4123`);
});

module.exports = app;
