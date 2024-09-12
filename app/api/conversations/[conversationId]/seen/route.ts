import getCurrentUser from '@/app/actions/getCurrentUser';
import { get, patch } from '@/app/utils/fetch';
import { NextResponse } from 'next/server';

interface IParams {
	conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
	try {
		const currentUser = await getCurrentUser();
		const { conversationId } = params;

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const conversation = await (
			await get(`conversations/${conversationId}`, {
				include: 'seen',
			})
		).json();
		if (!conversation.length) {
			return new NextResponse('Invalid ID', { status: 400 });
		}

		const lastMessage =
			conversation[0].messages[conversation[0].messages.length - 1];

		if (!lastMessage) {
			return NextResponse.json(conversation[0]);
		}

		const updatedMessage = await (
			await patch(`messages/${lastMessage.id}`, {
				currentUserId: currentUser.id,
				conversationId,
			})
		).json();

		return NextResponse.json(updatedMessage);
	} catch (error) {
		console.log(error, 'ERROR_MESSAGES_SEEN');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
