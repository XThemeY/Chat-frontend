import { cookies } from 'next/headers';
import getSession from './getSession';

export const getHeaders = async () => {
	const session = await getSession();
	const authCookie = cookies().get('authentication');

	if (!session?.user.id) {
		return {
			Cookie: '',
			Authorization: ``,
		};
	} else {
		return {
			Cookie: authCookie,
			Authorization: `Bearer ${session?.account?.access_token}`,
		};
	}
};
