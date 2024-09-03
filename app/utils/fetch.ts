import { cookies } from 'next/headers';
import { FetchOptions } from '../lib/@types';
import { JWT } from 'next-auth/jwt';
import { setCookie } from './cookies';
import { getHeaders } from './getHeaders';
import { signOut } from 'next-auth/react';

export const post = async (
	path: string,
	data: object,
	options: FetchOptions = { protected: true }
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

export const del = async (
	path: string,
	data: object,
	options: FetchOptions = { protected: true }
) => {
	const authHeaders = options.protected ? await getHeaders() : {};

	const res = await fetch(`${process.env.BACKEND_URL}/${path}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
		body: JSON.stringify(data),
	});

	return res;
};

export const patch = async (
	path: string,
	data: object,
	options: FetchOptions = { protected: true }
) => {
	const authHeaders = options.protected ? await getHeaders() : {};

	const res = await fetch(`${process.env.BACKEND_URL}/${path}`, {
		method: 'PATCH',
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
	params?: { [key: string]: string } | undefined,
	options: FetchOptions = { protected: true }
) => {
	const authHeaders = options.protected ? await getHeaders() : {};
	const newParams = params ? `?${new URLSearchParams(params).toString()}` : '';

	const res = await fetch(`${process.env.BACKEND_URL}/${path}` + newParams, {
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

// export const logOut = async () => {
// 	await signOut({ redirect: false });
// 	const authHeaders = await getHeaders();
// 	const res = await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
// 		method: 'POST',
// 		headers: { ...authHeaders },
// 	});
// 	setCookie(res);
// };
