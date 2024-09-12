import { useEffect, useState } from 'react';
import useActiveList from './useActiveList';
import useSocket from './useSocket';
import { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

const useActiveChannel = () => {
	const { members, set, add, remove } = useActiveList();
	const [activeChannel, setActiveChannel] = useState<Socket | null>();
	const socket = useSocket();
	const session = useSession();
	const currentUserId = session?.data?.user?.id;
	console.log('members', members);

	useEffect(() => {
		let channel = activeChannel;
		if (currentUserId) {
			if (!channel) {
				channel = socket?.emit('subscribe', {
					room: 'presense-messenger',
					userId: currentUserId,
				});
				setActiveChannel(channel);
			}
			if (activeChannel) {
				channel?.on('app:subscription_succeeded', (members) => {
					const initialMembers: string[] = [];
					members.forEach((member: Record<string, any>) => {
						initialMembers.push(member.id);
					});
					set(initialMembers);
				});

				channel?.on('app:member_added', (member: Record<string, any>) => {
					add(member.id);
					console.log('member added', member);
				});

				channel?.on('app:member_removed', (member: Record<string, any>) => {
					remove(member.id);
					console.log('member_removed', member);
				});

				console.log('clientID', activeChannel?.id);
			}
		}
		return () => {
			if (activeChannel) {
				channel?.emit('unsubscribe', {
					room: 'presense-messenger',
					userId: currentUserId,
				});
				console.log('unsubscribe');
				channel?.off('app:member_added');
				channel?.off('app:member_removed');
				setActiveChannel(null);
			}
		};
	}, [activeChannel, add, remove, set, socket, currentUserId]);
};

export default useActiveChannel;
