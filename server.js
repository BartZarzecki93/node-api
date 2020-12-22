import express, {
	json,
	static as st,
} from 'express';
import { join } from 'path';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import errorHandler from './middleware/error';
import bootcamps from './routes/bootcamps';
import courses from './routes/courses';
import auth from './routes/auth';
import connectDB from './config/db';
import users from './routes/users';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import reviews from './routes/reviews';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

import dotenv from 'dotenv';

// Load env vars
dotenv.config({
	path: './config/config.env',
});

// Connect to database
connectDB();

const app = express();

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument)
);

//body parser
app.use(json());
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(fileupload());

//Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

//set static folder
app.use(st(join(__dirname, 'public')));

//app.use('/api/v1/auth', auth);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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
