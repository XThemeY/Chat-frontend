import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FullConversationType, User } from '../lib/@types';

const useOtherUser = (
	conversation: FullConversationType | { users: User[] }
) => {
	const session = useSession();

	const otherUser = useMemo(() => {
		const currentUserId = session?.data?.user?.id;
		const otherUser = conversation.users.filter(
			(user) => user.id !== currentUserId
		);

		return otherUser[0];
	}, [conversation.users, session?.data?.user?.id]);

	return otherUser;
};

export default useOtherUser;
