/* eslint-disable prettier/prettier */
//* This line adds 'requireFromRoot' to global object and makes it usable from anywhere in the code
const express = require('express');


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

function convertDate(input = "") {
    let date;
    if (input === "") {
      date = new Date();
    } else if (!isNaN(input)) {
      date = new Date(parseInt(input));
    } else {
      date = new Date(input);
    }
    if (isNaN(date.getTime())) {
      return { error: "Invalid Date" };
    } 
      return {
        unix: date.getTime(),
        utc: date.toUTCString()
      };
    
}
app.use('/api/:date', (req, res, next) => {
    const { date } = { ...req.params }
    const formattedDate = convertDate(date);
    return res.status(200).json(formattedDate);
});

app.use('/api', (req, res, next) => {
    const formattedDate = convertDate();
    return res.status(200).json(formattedDate);        
});

app.listen(4123, () => {
    console.log(`Listening to port 4123`);
});

module.exports = app;
