import getCurrentUser from '@/app/actions/getCurrentUser';
import { patch } from '@/app/utils/fetch';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const data = await request.json();
		const { name, image } = data;

		if (!currentUser?.id) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const updatedUser = await (
			await patch(`users/${currentUser.id}`, {
				name,
				image: image,
			})
		).json();

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.log(error, 'ERROR_SETTINGS');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
