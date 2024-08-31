import { cookies } from 'next/headers';
import getSession from './getSession';

export const getHeaders = async () => {
	const session = await getSession();

	if (!session?.user.id) {
		cookies().delete('authentication');
		return {
			Cookie: '',
			Authorization: ``,
		};
	} else {
		return {
			Cookie: cookies().toString(),
			Authorization: `Bearer ${session?.account?.access_token}`,
		};
	}
};
