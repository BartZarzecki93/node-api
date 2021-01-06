import { connection } from 'mongoose';

/**
 * Close the db and server.
 */
export const closeDatabase = async () => {
	await connection.close();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
	const collections = Object.keys(
		connection.collections
	);

	for (const key of collections) {
		const collection =
			connection.collections[key];
		await collection.deleteMany();
	}
};
