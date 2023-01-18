/* eslint-disable prettier/prettier */
//* This line adds 'requireFromRoot' to global object and makes it usable from anywhere in the code
const express = require('express');
const url = require('url');
const shortid = require('shortid');
const cors = require('cors');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();
const corsOptions = {
    exposedHeaders: 'Content-Range',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use('/public', express.static(process.cwd() + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.get('/page/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    // req.file contains information about the uploaded file
    const { originalname, mimetype, size } = req.file
    // send the file information as a JSON response
    res.json({ name: originalname, type: mimetype, size })
})

app.listen(4123, () => {
    console.log(`Listening to port 4123`);
});

module.exports = app;
