import { DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			name?: string | null | undefined;
			login?: string;
			email?: string | null | undefined;
			image?: string | null | undefined;
		};
		account: {
			provider: string | undefined;
			providerAccountId: string | undefined;
			access_token?: string | undefined;
			expires_at?: number | undefined;
		};
	}

	interface User {
		user: {
			id: string;
			name?: string | null | undefined;
			login?: string;
			email?: string | null | undefined;
			image?: string | null | undefined;
		};
		account?: {
			provider: string | undefined;
			providerAccountId: string | undefined;
			access_token?: string | undefined;
			expires_at?: number | undefined;
		};
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		user: {
			id: string;
			name?: string | null | undefined;
			login?: string;
			email?: string | null | undefined;
			image?: string | null | undefined;
		};
		account: {
			provider: string | undefined;
			providerAccountId: string | undefined;
			access_token?: string | undefined;
			expires_at?: number | undefined;
		};
	}
}
