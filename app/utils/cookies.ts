import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export const setCookie = async (res: Response) => {
	const cookieHeaders = res.headers.get('Set-Cookie');
	if (cookieHeaders) {
		const token = cookieHeaders.split(';')[0].split('=')[1];
		cookies().set({
			name: 'authentication',
			value: token,
			httpOnly: true,
			expires: new Date(jwtDecode(token).exp! * 1000),
			secure: process.env.NODE_ENV === 'production',
		});
	} else {
		cookies().delete('authentication');
	}
};
