'use client';

import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth({
	pages: {
		signIn: '/',
	},
});

export const config = {
	matcher: ['/users/:path*', '/conversations/:path*'],
};

export function middleware(request: NextRequest) {
	if (
		!request.cookies.has('authentication') ||
		!request.cookies.has('next-auth.session-token')
	) {
		return NextResponse.redirect(new URL('/', request.url));
	}
}
