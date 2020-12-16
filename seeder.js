const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env
dotenv.config({
	path: './config/config.env',
});

//Load Models
const Bootcamp = require('./models/Bootcamps');
const Course = require('./models/Courses');
const Users = require('./models/Users');
const Reviews = require('./models/Reviews');

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

//Read Json files

const bootcamps = JSON.parse(
	fs.readFileSync(
		`${__dirname}/_data/bootcamps.json`,
		'utf-8'
	)
);

const courses = JSON.parse(
	fs.readFileSync(
		`${__dirname}/_data/courses.json`,
		'utf-8'
	)
);

const users = JSON.parse(
	fs.readFileSync(
		`${__dirname}/_data/users.json`,
		'utf-8'
	)
);

const reviews = JSON.parse(
	fs.readFileSync(
		`${__dirname}/_data/reviews.json`,
		'utf-8'
	)
);

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await Users.create(users);
		await Reviews.create(reviews);
		console.log(`Data imported`.green.inverse);
		process.exit();
	} catch (error) {
		console.log(error.message.red);
	}
};

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

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
