import { User } from '../lib/@types/user';
import { get } from '../utils/fetch';
import getSession from './getSession';

const getUsers = async () => {
	try {
		const session = await getSession();
		if (!session?.user.id) {
			return [];
		}
		const response = await get(`users/`);
		const users: User[] = await response.json();
		return users;
	} catch (error) {
		return [];
	}
};

export default getUsers;
