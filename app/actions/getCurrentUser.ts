import getSession from './getSession';
import { get } from '../utils/fetch';
import { User } from '../lib/@types/users';

const getCurrentUser = async () => {
	try {
		const session = await getSession();
		if (!session?.user.id) {
			return null;
		}
		const response = await get(`users/${session.user.id}`);

		const currentUser: User = await response.json();

		if (!currentUser) {
			return null;
		}
		return currentUser;
	} catch (error) {
		return null;
	}
};

export default getCurrentUser;
