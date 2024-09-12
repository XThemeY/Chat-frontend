'use client';
import useConversation from '@/app/hooks/useConversation';
import { FullConversationType, User } from '@/app/lib/@types';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';
import GroupChatModal from './GroupChatModal';
import { useSession } from 'next-auth/react';
import useSocket from '@/app/hooks/useSocket';
import { find } from 'lodash';

interface ConversationListProps {
	initialItems: FullConversationType[];
	users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
	initialItems,
	users,
}) => {
	const session = useSession();
	const [items, setItems] = useState(initialItems);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const socket = useSocket();

	const { conversationId, isOpen } = useConversation();

	const socketKey = useMemo(() => {
		return session?.data?.user?.id;
	}, [session?.data?.user?.id]);

	useEffect(() => {
		if (!socketKey) {
			return;
		}

		const newHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				if (find(current, { id: conversation.id })) {
					return current;
				}
				return [conversation, ...current];
			});
		};

		const updateHandler = (conversation: FullConversationType) => {
			setItems((current) =>
				current.map((currentConversation, index) => {
					if (currentConversation.id === conversation.id) {
						return {
							...currentConversation,
							messages: conversation.messages,
						};
					}
					return currentConversation;
				})
			);
		};

		const deleteHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				return [
					...current.filter(
						(currentConversation) => currentConversation.id !== conversation.id
					),
				];
			});
			if (conversation.id === conversationId) {
				router.push('/conversations');
			}
		};

		if (socket) {
			socket.emit('subscribe', { room: socketKey });
			socket.on('conversation:new', newHandler);
			socket.on('conversation:update', updateHandler);
			socket.on('conversation:delete', deleteHandler);

			return () => {
				socket.emit('unsubscribe', { room: socketKey });
				socket.off('conversation:new', newHandler);
				socket.off('conversation:update', updateHandler);
				socket.off('conversation:delete', deleteHandler);
			};
		}
	}, [socketKey, socket, conversationId, router]);

	return (
		<>
			<GroupChatModal
				users={users}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<aside
				className={clsx(
					`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
					isOpen ? 'hidden' : 'block w-full left-0'
				)}>
				<div className='px-5'>
					<div className='flex justify-between mb-4 pt-4'>
						<div className='text-2xl font-bold text-neutral-800'>Messages</div>
						<button
							onClick={() => setIsModalOpen(true)}
							className='rounded-full p-2 bg-gray-100 text-gray-600 hover:opacity-75 transition'>
							<MdOutlineGroupAdd size={20} />
						</button>
					</div>
					{items.map((item) => (
						<ConversationBox
							key={item.id}
							data={item}
							selected={conversationId === item.id}
						/>
					))}
				</div>
			</aside>
		</>
	);
};

export default ConversationList;
