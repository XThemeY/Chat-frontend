import { get } from '@/app/utils/fetch';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const response = await get('upload');
		const data = await response.json();

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.log(error, 'ERROR_UPLOAD');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
