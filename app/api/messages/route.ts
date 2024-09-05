import getCurrentUser from '@/app/actions/getCurrentUser';
import { patch, post } from '@/app/utils/fetch';
import socket from '@/app/utils/socket';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();

		const body = await request.json();

		const { message, image, conversationId } = body;

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const responseMessage = await post(`messages`, {
			message,
			image,
			conversationId,
			userId: currentUser.id,
		});

		const newMessage = await responseMessage.json();
		socket.emit('newMessage', conversationId, newMessage);
		const updatedConversations = await (
			await patch(`conversations`, {
				conversationId,
				lastMessageAt: newMessage.createdAt,
				messageId: newMessage.id,
			})
		).json();

		// const lastMessage =
		// 	updatedConversations.messages[updatedConversations.messages.length - 1];

		// updatedConversations.users.map((user) => {
		// 	socket.emit('newMessage', user.id, lastMessage);
		// });
		return new NextResponse(newMessage, { status: 201 });
	} catch (error) {
		console.log(error, 'ERROR_MESSAGES');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
