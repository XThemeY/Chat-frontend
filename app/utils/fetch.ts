import { cookies } from 'next/headers';
import { FetchOptions } from '../lib/@types';
import { getHeaders } from '../actions/getHeaders';

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

export const refreshToken = async (): Promise<Response> => {
	const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
		method: 'POST',
		headers: { Cookie: cookies().toString() },
	});
	return res;
};
