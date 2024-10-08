import { get } from '../utils/fetch';

const getMessages = async (conversationsId: string) => {
	try {
		const response = await get(`messages/${conversationsId}`);
		if (!response.ok) {
			throw new Error(`${response.status}:${response.statusText}`);
		}
		const messages = await response.json();
		return messages;
	} catch (error) {
		return [];
	}
};

export default getMessages;
