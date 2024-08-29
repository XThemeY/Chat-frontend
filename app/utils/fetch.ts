import { cookies } from 'next/headers';

const getHeaders = () => ({
	Cookie: cookies().toString(),
});

export const post = async (path: string, data: object) => {
	console.log(getHeaders());

	const res = await fetch(`${process.env.BACKEND_URL}/${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...getHeaders(),
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error('Bad Request');
	}

	return res;
};

export const get = async (path: string) => {
	const res = await fetch(`${process.env.BACKEND_URL}/${path}`, {
		headers: { ...getHeaders() },
	});
	const parsedRed = await res.json();
	if (!res.ok) {
		throw new Error(parsedRed.message);
	}
	return parsedRed;
};
