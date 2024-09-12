import { get } from '../utils/fetch';
import getCurrentUser from './getCurrentUser';

const getConversationById = async (conversationId: string) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser?.id) {
			return null;
		}

		const response = await get(`conversations/${conversationId}`);

		if (!response.ok) {
			throw new Error(`${response.status}:${response.statusText}`);
		}
		const conversation = await response.json();

		return conversation[0];
	} catch (error) {
		console.log('getConversationById', error);
		return null;
	}
};

export default getConversationById;
