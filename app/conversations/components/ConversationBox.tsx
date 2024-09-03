'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FullConversationType } from '@/app/lib/@types';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/Avatar';

interface ConversationBoxProps {
	data: FullConversationType;
	selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
	data,
	selected,
}) => {
	const otherUser = useOtherUser(data);
	const session = useSession();
	const router = useRouter();

	const handleClick = useCallback(() => {
		router.push(`/conversations/${data.id}`);
	}, [data.id, router]);

	const lastMessage = useMemo(() => {
		const messages = data.messages || [];
		return messages[messages.length - 1];
	}, [data.messages]);

	const userId = useMemo(() => {
		return session?.data?.user?.id;
	}, [session?.data?.user?.id]);
	const hasSeen = useMemo(() => {
		if (!lastMessage) {
			return false;
		}
		const seenArray = lastMessage.seen || [];
		if (!userId) {
			return false;
		}
		return seenArray.filter((user) => user.id === userId).length !== 0;
	}, [userId, lastMessage]);

	const lastMessageText = useMemo(() => {
		if (lastMessage?.image) {
			return 'Sent an image';
		}
		if (lastMessage?.attachments.length) {
			return 'Sent an attachment';
		}
		if (lastMessage?.body) {
			return lastMessage.body;
		}
		return 'Started a conversation';
	}, [lastMessage]);

	return (
		<button
			onClick={handleClick}
			className={clsx(
				`w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition p-3 text-left`,
				selected ? 'bg-neutral-100' : 'bg-white'
			)}>
			<Avatar user={otherUser} />
			<div className='min-w-0 flex-1'>
				<div className='focus:outline-none'>
					<div className='flex justify-between items-center mb-1'>
						<p className='text-md font-medium text-gray-900'>
							{data.name || otherUser.name}
						</p>

						{lastMessage?.createdAt && (
							<p className='text-xs font-light text-gray-400'>
								{format(new Date(lastMessage.createdAt), 'HH:mm')}
							</p>
						)}
					</div>
					<p
						className={clsx(
							'text-sm truncate',
							hasSeen ? 'text-gray-500' : 'text-black font-bold'
						)}>
						{lastMessageText}
					</p>
				</div>
			</div>
		</button>
	);
};

export default ConversationBox;
