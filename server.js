const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const connectDB = require('./config/db');

//load env
dotenv.config({
	path: './config/config.env',
});

//connect db
connectDB();

const app = express();

//body parser
app.use(express.json());
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(fileupload());

//set static folder
app.use(
	express.static(path.join(__dirname, 'public'))
);

app.use('/api/v1/auth', auth);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
	console.log(
		`Server runs on port ${PORT}`.yellow.bold
	)
);

//handle unhandled rejections
process.on(
	'unhandledRejection',
	(err, promise) => {
		console.log(`Error: ${err.message}`.red);
		server.close(() => process.exit(1));
	}
);
