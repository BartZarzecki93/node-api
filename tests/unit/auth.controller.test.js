import * as user from '../../controllers/auth';
import {
	connectDB,
	closeDatabase,
	clearDatabase,
} from '../db-handler';
import Users from '../../models/Users';
import httpMocks from 'node-mocks-http';
import newUser from '../mock-data/new-user.json';

Users.create = jest.fn();

let res, req, next;

beforeEach(async () => {
	res = httpMocks.createResponse();
	req = httpMocks.createRequest();
	next = null;
});

describe('register', () => {
	it('should have a register function', async () => {
		expect(typeof user.register).toBe(
			'function'
		);
	});
});
