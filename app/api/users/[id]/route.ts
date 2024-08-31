import { get } from '@/app/utils/fetch';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	console.log('id', params);
	try {
		const id = params.id;

		const res = await get(`users/${id}`);

		const user = await res.json();

		if (res.ok && user) {
			return new NextResponse(user, { status: res.status });
		}

		return new NextResponse(res.statusText, { status: res.status });
	} catch (error) {
		console.log(error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
