import getCurrentUser from '@/app/actions/getCurrentUser';

import { NextResponse } from 'next/server';
import { get, post } from '@/app/utils/fetch';

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse('Invalid data', { status: 400 });
		}

		if (isGroup) {
			const newConversation = await (
				await post(`conversations`, {
					currentUserId: currentUser.id,
					isGroup,
					members,
					name,
				})
			).json();

			return NextResponse.json(newConversation);
		}

		const existingConversations = await (
			await get(`conversations`, {
				currentUserId: currentUser.id,
				userId,
			})
		).json();
		if (existingConversations.length) {
			return NextResponse.json(existingConversations[0]);
		}

		const newConversation = await (
			await post(`conversations`, {
				userId,
				currentUserId: currentUser?.id,
			})
		).json();

		return NextResponse.json(newConversation);
	} catch (error) {
		console.log(error, 'ERROR_CONVERSATIONS');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
