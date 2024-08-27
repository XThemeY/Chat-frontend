import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import VkProvider from 'next-auth/providers/vk';
import YandexProvider from 'next-auth/providers/yandex';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		// VkProvider({
		// 	clientId: process.env.VK_CLIENT_ID as string,
		// 	clientSecret: process.env.VK_CLIENT_SECRET as string,
		// }),
		YandexProvider({
			clientId: process.env.YANDEX_CLIENT_ID as string,
			clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'сredentials',
			credentials: {
				login: { label: 'Login', type: 'text' },
				password: { label: 'Password', type: 'password' },
				confirmPassword: { label: 'Confirm Password', type: 'password' },
			},
			async authorize(credentials, req) {
				if (
					!credentials?.login ||
					!credentials?.password ||
					!credentials?.confirmPassword
				) {
					throw new Error('Empty fields');
				}
				if (credentials?.password !== credentials?.confirmPassword) {
					throw new Error('Passwords do not match');
				}
				const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
					method: 'POST',
					body: JSON.stringify(credentials),
					headers: { 'Content-Type': 'application/json' },
				});

				const user = await res.json();

				if (res.ok && user) {
					return user;
				}

				throw new Error('Invalid credentials');
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ user, account, profile }) {
			console.log('signInAUTHMEGA', user, account, profile);
			return true;
		},
		async redirect({ url, baseUrl }) {
			return '/';
		},
		async session({ session, token }) {
			// console.log('session', session, token);
			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
