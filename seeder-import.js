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

connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

//Read Json files

const bootcamps = JSON.parse(
	rf(
		`${__dirname}/_data/bootcamps.json`,
		'utf-8'
	)
);

const courses = JSON.parse(
	rf(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
	rf(`${__dirname}/_data/users.json`, 'utf-8')
);

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await Users.create(users);
		console.log(`Data imported`.green.inverse);
		process.exit();
	} catch (error) {
		console.log(error.message.red);
	}
};

importData();
//deleteData();

// importData();
// if (process.argv[2] === '-i') {
// 	importData();
// } else if (process.argv[2] === '-d') {
// 	deleteData();
// }
