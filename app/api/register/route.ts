import { post } from '@/app/utils/fetch';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const { name, login, password, confirmPassword, type, provider } = body;

		if (password !== confirmPassword) {
			return new NextResponse('Passwords do not match', { status: 400 });
		}

		if (!name || !login || !password) {
			return new NextResponse('Invalid data', { status: 400 });
		}
		const res = await post('auth/register', {
			name,
			login,
			password,
			type,
			provider,
		});

		if (res.status === 201) {
			return new NextResponse();
		}

		throw new Error('Internal error');
	} catch (error) {
		console.log(error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
