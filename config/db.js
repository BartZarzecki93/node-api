import { connect } from 'mongoose';

const connectDB = async () => {
	const dbURL =
		process.env.NODE_ENV === 'testing'
			? process.env.MONGO_URI_TEST
			: process.env.MONGO_URI;

	const conn = await connect(dbURL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});
	console.log(
		`Mongo DB connected ${conn.connection.host}, db is ${conn.connection.db.databaseName}`
			.cyan.underline.bold
	);
};

export default connectDB;
