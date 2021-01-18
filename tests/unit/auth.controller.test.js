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
import { genSalt, hash, compare } from 'bcryptjs';
import ErrorResponse from '../../utils/errorResponse';

let res, req, next;

beforeEach(async () => {
	res = httpMocks.createResponse();
	req = httpMocks.createRequest();
	next = jest.fn();
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
		expect(res.statusCode).toBe(200);
		expect(
			res._getJSONData().token
		).not.toBeNull();
		expect(res._isEndCalled()).toBeTruthy();
	});
});

describe('login', () => {
	it('should have a login function', async () => {
		expect(typeof user.login).toBe('function');
	});
	it('should call login function', async () => {
		//passing data to req
		req.body = {
			email: newUser.email,
			password: newUser.password,
		};
		const salt = await genSalt(10);
		newUser.password = await hash(
			newUser.password,
			salt
		);

		const findTestUser = (Users.findOne.select = jest
			.fn()
			.mockReturnValue(newUser));

		mockingoose(Users).toReturn(
			findTestUser,
			'findOne'
		);
		const testResult = await Users.findOne();

		//passing data to the mockReturnValue and testing
		Users.findOne.select.mockReturnValue(
			testResult
		);
		await user.login(req, res, next);

		expect(
			Users.findOne.select
		).toHaveBeenCalledTimes(2);
		expect(res.statusCode).toBe(200);
		expect(res._getJSONData().success).toBe(
			true
		);
		expect(
			res._getJSONData().token
		).not.toBeNull();
		expect(res._isEndCalled()).toBeTruthy();
	});
	it('should handle error', async () => {
		//passing data to req
		req.body = {
			email: newUser.email,
			password: newUser.password,
		};

		const findTestUser = (Users.findOne.select = jest
			.fn()
			.mockReturnValue(newUser));

		mockingoose(Users).toReturn(
			findTestUser,
			'findOne'
		);
		const testResult = await Users.findOne();

		//passing data to the mockReturnValue and testing
		Users.findOne.select.mockReturnValue(
			testResult
		);
		await user.login(req, res, next);

		expect(next).toHaveBeenCalledWith(
			new ErrorResponse(
				'Invalid credentials',
				401
			)
		);
	});
});
