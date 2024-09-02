import { Conversation } from './conversation';
import { Message } from './message';

export type User = {
	id: string;
	name: string;
	login: string;
	email: string;
	emailVerified: boolean;
	gender: string;
	image: string;
	conversationId: string[];
	conversations: Conversation[];
	seenMessageIds: string[];
	seenMessages: Message[];
	createdAt: Date;
	updatedAt: Date;

	messages: Message[];
};
