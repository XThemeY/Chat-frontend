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

		const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
			method: 'POST',
			body: JSON.stringify({ name, login, password, type, provider }),
			headers: { 'Content-Type': 'application/json' },
		});
		const user = await res.json();
		if (res.ok && user) {
			return new NextResponse(user);
		}

		throw new Error('Internal error');
	} catch (error) {
		return new NextResponse('Internal Error', { status: 500 });
	}
}
