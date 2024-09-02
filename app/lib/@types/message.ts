import { User } from './user';

export type Message = {
	id: string;
	body: string;
	image: string;
	attachments: string[];
	createdAt: Date;
	isChanged: boolean;
};

export type FullMessageType = Message & { sender: User; seen: User[] };
