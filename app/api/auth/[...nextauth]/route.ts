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
			async profile(profile) {
				return {
					id: profile.id,
					name: profile.display_name,
					email: profile.default_email,
				};
			},
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

				try {
					const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
						method: 'POST',
						body: JSON.stringify(credentials),
						headers: {
							'Content-Type': 'application/json',
						},
					});
					const auth = await res.json();

					if (res.ok && auth) {
						return auth;
					}
				} catch (error) {
					throw new Error('Invalid credentials');
				}
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
			const { name, email, image } = user;

			try {
				const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
					method: 'POST',
					body: JSON.stringify({
						name,
						email,
						type,
						provider,
						image,
						providerAccountId,
					}),
					headers: { 'Content-Type': 'application/json' },
				});

				const response = await res.json();

				user.id = response.user.id;
				user.image = response.user.image;

				if (res.ok) {
					return true;
				}
			} catch (error) {
				throw new Error('Login error');
			}
			return false;
		},

		async jwt({ token, user, trigger, account }) {
			if (user?.account && user?.user && account?.provider === 'credentials') {
				token.account = user.account;
				token.user = user.user;
				return token;
			}
			if (account) {
				token.account = account;
			}
			if (user) {
				token.user = user;
			}
			return token;
		},
		async session({ token, session }) {
			session.user = token.user;
			session.account = token.account;
			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
