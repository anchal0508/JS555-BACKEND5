require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const db = require('./models/index');

const limiter = rateLimit({
    windowMs: 16 * 60 * 1000,   // how long to remember request for, in miliseconds.
    limit: 100,                 // how many requests to allow.
    standardHeaders: 'draft-8', // set Ratelimit header
    message: { message: "Too many requests, please try again later." }
});


app.use(limiter);

// holds data when res.json executes, and final compression done in reverse order or our written code
app.use(compression()); // compression middleware

// can not put web app in <iframe>
// force to open in https only
// Basically: sets HTTP response headers
app.use(helmet());

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true   // True: allows to store cookies, if false, won't store cookies in Applicaiton/cookies of browser
// }));
app.use(cors({
    // origin: 'http://localhost:5173', // 
    origin: 'https://project.abcrob.in', // 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// It can get the data from POSTMAN. Ex: information available in the link [Ex: name=Rahul&age=25]
app.use(express.json());

// Parse data form <form> tag's info, 
// true=> supports nexted object (qs lib), 
// false=> don't suporot nested object use buildin lib (querystring)
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());    // keep it here, to get cookie once the object's data has been fetched


// ==================================== Routes =============================================

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);



app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Somthing is wrong in Backend Server";
    console.log(message);

    return res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    })
})

const PORT = process.env.PORT || 3000;
db.sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully...");
        return db.sequelize.sync(); 
    })
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Backend Server is Online on port ${PORT}...`);
        });
    })
    .catch((err) => {
        console.error(" DATABASE CONNECTION ERROR:", err.message);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server started in fallback mode on port ${PORT} due to DB error.`);
        });
    });