export type User = {
	id: string;
	name: string;
	login: string;
	email: string;
	emailVerified: boolean;
	gender: string;
	image: string;
	conversationId: string[];
	seenMessageIds: string[];
	createdAt: Date;
	updatedAt: Date;
};
