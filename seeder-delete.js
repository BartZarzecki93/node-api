import { readFileSync as rf } from 'fs';
import { connect } from 'mongoose';
import colors from 'colors';
import { config } from 'dotenv';

//load env
config({
	path: './config/config.env',
});

//Load Models
import Bootcamp from './models/Bootcamps';

import Course from './models/Courses';

import Users from './models/Users';

import Reviews from './models/Reviews'

connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await Users.deleteMany();
		await Reviews.deleteMany();
		console.log(`Data destroyed`.red);
		process.exit();
	} catch (error) {
		console.log(error.message.red);
	}
};

deleteData();

// importData();
// if (process.argv[2] === '-i') {
// 	importData();
// } else if (process.argv[2] === '-d') {
// 	deleteData();
// }
