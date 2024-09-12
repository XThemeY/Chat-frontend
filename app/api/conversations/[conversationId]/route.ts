import getCurrentUser from '@/app/actions/getCurrentUser';
import { del, get } from '@/app/utils/fetch';
import { NextResponse } from 'next/server';

interface IParams {
	conversationId?: string;
}

export async function DELETE(
	request: Request,
	{ params }: { params: IParams }
) {
	try {
		const currentUser = await getCurrentUser();
		const { conversationId } = params;

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const existingConversations = await (
			await get(`conversations/${conversationId}`)
		).json();

		if (!existingConversations.length) {
			return new NextResponse('Invalid ID', { status: 400 });
		}

		const deletedConversation = await (
			await del(`conversations/${conversationId}`, {
				currentUserId: currentUser.id,
			})
		).json();

		return NextResponse.json(deletedConversation);
	} catch (error) {
		console.log(error, 'ERROR_CONVERSATION_DELETE');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
