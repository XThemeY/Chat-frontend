'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/lib/@types';
import { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';
import axios from 'axios';
import useSocket from '@/app/hooks/useSocket';
import { find } from 'lodash';

interface BodyProps {
	initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);
	const { conversationId } = useConversation();
	const socket = useSocket();

	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`, {
			conversationId,
		});
	}, [conversationId]);

	useEffect(() => {
		const messageHandler = (message: FullMessageType) => {
			axios.post(`/api/conversations/${conversationId}/seen`, {
				conversationId,
			});
			setMessages((current) => {
				if (find(current, { id: message.id })) {
					return current;
				}
				return [...current, message];
			});
			bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
		};

		const updateMessageHandler = (newMessage: FullMessageType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) {
						return newMessage;
					}
					return currentMessage;
				})
			);
		};

		if (socket) {
			socket.emit('subscribe', { room: conversationId });
			bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
			socket.on('message:new', messageHandler);
			socket.on('message:update', updateMessageHandler);
			return () => {
				socket.emit('unsubscribe', { room: conversationId });
				socket.off('message:new', messageHandler);
				socket.off('message:update', updateMessageHandler);
			};
		}
	}, [conversationId, socket]);

	return (
		<div className='flex-1 overflow-y-auto'>
			{messages.map((message, i) => (
				<MessageBox
					key={message.id}
					data={message}
					isLast={i === messages.length - 1}
				/>
			))}

			<div ref={bottomRef} className='pt-24' />
		</div>
	);
};

export default Body;
