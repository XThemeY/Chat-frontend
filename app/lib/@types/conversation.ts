import { FullMessageType } from './message';
import { User } from './user';

export type Conversation = {
	id: string;
	name: string;
	isGroup: boolean;
	messageIds: string[];
	lastMessageAt: Date;
	createdAt: Date;
	userIds: string[];
};

export type FullConversationType = Conversation & {
	users: User[];
	messages: FullMessageType[];
};
