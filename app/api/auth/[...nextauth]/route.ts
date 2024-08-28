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
			async profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
				};
			},
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
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const auth = await res.json();

				if (res.ok && auth) {
					return auth.user;
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
			if (account?.provider === 'credentials') {
				return true;
			}

			if (!account) {
				return false;
			}

			const { provider, providerAccountId, type } = account;
			const { name, email } = user;

			const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
				method: 'POST',
				body: JSON.stringify({
					name,
					email,
					type,
					provider,
					providerAccountId,
				}),
				headers: { 'Content-Type': 'application/json' },
			});
			console.log('user', user);
			console.log('account', account);
			console.log('profile', profile);

			if (res.ok) {
				return true;
			}

			return false;
		},

		async jwt({ token, user, trigger }) {
			if (user) {
				console.log('jwt token', token);
				console.log('jwt user', user);
				return { ...token, ...user };
			}

			return token;
		},
		async session({ token, session }) {
			if (session?.user) {
				session.user = token.user;
				session.account = token.account;
			}

			console.log('session', session);
			console.log('session token', token);
			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
