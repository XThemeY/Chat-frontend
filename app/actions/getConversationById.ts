import { get } from '../utils/fetch';
import getCurrentUser from './getCurrentUser';

const getConversationById = async (conversationId: string) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return null;
		}

		const response = await get(`conversations/${conversationId}`);

		const conversation = await response.json();

		return conversation;
	} catch (error) {
		return null;
	}
};

export default getConversationById;
