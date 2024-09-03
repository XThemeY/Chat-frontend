import { FullConversationType } from '../lib/@types';
import { get } from '../utils/fetch';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return [];
	}
	try {
		const response = await get(`conversations`, {
			currentUserId: currentUser.id,
		});

		const conversations: FullConversationType[] = await response.json();
		return conversations;
	} catch (error) {
		return [];
	}
};

export default getConversations;
