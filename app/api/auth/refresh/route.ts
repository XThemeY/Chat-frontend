import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const cookieHeaders = request.headers.get('Set-Cookie');
		if (cookieHeaders) {
			const token = cookieHeaders.split(';')[0].split('=')[1];

			cookies().set({
				name: 'authentication',
				value: token,
				httpOnly: true,
				expires: new Date(jwtDecode(token).exp! * 1000),
				secure: false,
				sameSite: 'lax',
			});
		} else {
			cookies().delete('authentication');
		}

		return await request.json();
	} catch (error) {
		console.log(error, 'ERROR_REFRESH');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
