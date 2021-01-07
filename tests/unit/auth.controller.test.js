import * as user from '../../controllers/auth';
import {
	connectDB,
	closeDatabase,
	clearDatabase,
} from '../db-handler';
import Users from '../../models/Users';
import httpMocks from 'node-mocks-http';
import newUser from '../mock-data/new-user.json';
import mockingoose from 'mockingoose';

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

	it('should call register function', async () => {
		//passing data to req
		req.body = newUser;

		//creating mongodb mock document with mockingoose
		const testUser = (Users.create = jest
			.fn()
			.mockReturnValue({ newUser }));

		mockingoose(Users).toReturn(
			testUser,
			'findOne'
		);
		const testResult = await Users.findOne();

		//passing data to the mockReturnValue and testing
		Users.create.mockReturnValue(testResult);
		await user.register(req, res, next);
		expect(Users.create).toBeCalledWith(
			newUser
		);
		expect(res._isEndCalled()).toBeTruthy();
	});
});

describe('login', () => {
	it('should have a register function', async () => {
		expect(typeof user.login).toBe('function');
	});
});
