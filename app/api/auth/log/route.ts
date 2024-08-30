import { get } from '@/app/utils/fetch';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const res = await get('auth/log', { protected: true });

		return new NextResponse(null, { status: res.status });
	} catch (error) {
		console.log('error', { error });
		return new NextResponse('Internal Error', { status: 500 });
	}
}
