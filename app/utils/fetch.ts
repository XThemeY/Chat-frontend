import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { FetchOptions } from '../lib/@types';
import { JWT } from 'next-auth/jwt';
import { setCookie } from './cookies';

const getHeaders = async () => {
	const session = await getServerSession(authOptions);

	return {
		Cookie: cookies().toString(),
		Authorization: `Bearer ${session?.account?.access_token}`,
	};
};

export const post = async (
	path: string,
	data: object,
	options: FetchOptions = { protected: false }
) => {
	const authHeaders = options.protected ? await getHeaders() : {};

	const res = await fetch(`${process.env.BACKEND_URL}/${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
		body: JSON.stringify(data),
	});

	return res;
};

export const get = async (
	path: string,
	options: FetchOptions = { protected: false }
) => {
	const authHeaders = options.protected ? await getHeaders() : {};
	const res = await fetch(`${process.env.BACKEND_URL}/${path}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json', ...authHeaders },
	});

	return res;
};

export const refreshToken = async (token: JWT): Promise<JWT> => {
	const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
		method: 'POST',
		headers: { Cookie: cookies().toString() },
	});
	setCookie(res);
	const response = await res.json();
	return {
		...token,
		account: {
			...token.account,
			access_token: response.access_token,
			expires_at: response.expires_at,
		},
	};
};
