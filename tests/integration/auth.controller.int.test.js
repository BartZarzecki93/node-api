import {
	closeDatabase,
	clearDatabase,
} from '../db-handler';
import app from '../../app';
import newUser from '../mock-data/new-user.json';
import supertest from 'supertest';

const request = supertest(app);

const registerUrl = '/api/v1/auth/register';
const loginUrl = '/api/v1/auth/login';
const forgotUrl = '/api/v1/auth/forgotpassword';
const updateUrl = '/api/v1/auth/updatedetails';
const meUrl = '/api/v1/auth/me';
const passwordUrl = '/api/v1/auth/updatepassword';
const logoutUrl = '/api/v1/auth/logout';

let token = '';

beforeAll(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe(registerUrl, () => {
	it('POST ' + registerUrl, async () => {
		const response = await request
			.post(registerUrl)
			.send(newUser)
			.expect(200);

		expect(response.body.success).toBe(true);
	});

	it('POST ' + loginUrl, async () => {
		const response = await request
			.post(loginUrl)
			.send({
				password: '123456',
				email: 'admin@gmail.com',
			})
			.expect(200);

		token = response.body.token;
		expect(response.body.success).toBe(true);
		expect(response.body.token).not.toBe(null);
	});

	it('POST ' + forgotUrl, async () => {
		const response = await request
			.post(forgotUrl)
			.send({
				email: 'admin@gmail.com',
			})
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.data).toBe(
			'Email sent'
		);
	});

	it('GET ' + meUrl, async () => {
		const response = await request
			.get(meUrl)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
	});

	it('PUT ' + updateUrl, async () => {
		const response = await request
			.put(updateUrl)
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'bartoszPra@gmail.com',
				name: 'Bartolo',
			})
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.data.email).toBe(
			'bartoszPra@gmail.com'
		);
		expect(response.body.data.name).toBe(
			'Bartolo'
		);
		expect(response.body.data.role).toBe(
			newUser.role
		);
	});

	it('PUT ' + passwordUrl, async () => {
		const response = await request
			.put(passwordUrl)
			.set('Authorization', `Bearer ${token}`)
			.send({
				newPassword: '1234567',
				currentPassword: '123456',
			})
			.expect(200);

		expect(response.body.success).toBe(true);
	});

	it('GET ' + logoutUrl, async () => {
		const response = await request
			.get(logoutUrl)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
	});
});
