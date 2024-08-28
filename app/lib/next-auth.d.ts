import { DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
		};
		account: {
			provider: string;
			providerAccountId: string;
			access_token: string;
		};
	}

	interface User extends DefaultUser {}
}

declare module 'next-auth/jwt' {
	interface JWT {
		user: {
			id: string;
			name: string;
			email: string;
		};
		account: {
			provider: string;
			providerAccountId: string;
			access_token: string;
		};
	}
}
