import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, login, password, confirmPassword } = body;

		if (password !== confirmPassword) {
			return new NextResponse('Passwords do not match', { status: 400 });
		}

		if (!name || !login || !password) {
			return new NextResponse('Invalid data', { status: 400 });
		}

		const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
			method: 'POST',
			body: JSON.stringify({ name, login, password }),
			headers: { 'Content-Type': 'application/json' },
		});

		const accessToken = await res.json();
		return NextResponse.json(accessToken);
	} catch (error) {
		console.error(error, 'REGISTRATION_ERROR');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
