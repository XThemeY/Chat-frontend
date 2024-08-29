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
		};
		account: {
			provider: string | undefined;
			providerAccountId: string | undefined;
			access_token?: string | undefined;
		};
	}

	interface User extends DefaultUser {
		account?: {
			provider: string | undefined;
			providerAccountId: string | undefined;
			access_token?: string | undefined;
		};
		user?: {
			id: string;
			name?: string | null | undefined;
			login?: string;
			email?: string | null | undefined;
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
		};
		account: {
			provider: string | undefined;
			providerAccountId: string | undefined;
			access_token?: string | undefined;
		};
	}
}
