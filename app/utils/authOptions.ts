import GoogleProvider from 'next-auth/providers/google';
import VkProvider from 'next-auth/providers/vk';
import YandexProvider from 'next-auth/providers/yandex';
import CredentialsProvider from 'next-auth/providers/credentials';
import { post, refreshToken } from '@/app/utils/fetch';
import { AuthOptions } from 'next-auth';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			async profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					user: {
						id: profile.sub,
						name: profile.name,
						email: profile.email,
						image: profile.picture,
					},
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
					user: {
						id: profile.id,
						name: profile.display_name,
						email: profile.default_email,
					},
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
					const res = await post('auth/login', credentials, {
						protected: false,
					});

					const response = await setCookies(res);

					if (res.ok && response) {
						return response;
					}
				} catch (error) {
					console.log(error, 'ERROR_LOGIN');
					throw new Error('Login error');
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},

	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === 'credentials') {
				return true;
			}

			if (!account) {
				return false;
			}

			const { provider, providerAccountId, type } = account;
			const {
				user: { name, email, image },
			} = user;
			try {
				const res = await post(
					'auth/login',
					{
						name,
						email,
						type,
						provider,
						image,
						providerAccountId,
					},
					{ protected: false }
				);
				const response = await setCookies(res);

				user.user.id = response.user.id;
				user.image = response.user.image;
				user.account = response.account;

				if (res.ok) {
					return true;
				}
			} catch (error) {
				console.log(error, 'ERROR_OAUTH_LOGIN');
				throw new Error('Login error');
			}

			return false;
		},

		async jwt({ token, user }) {
			if (user) {
				return { ...token, ...user };
			}

			if (token.account.expires_at && Date.now() < token.account.expires_at) {
				return token;
			}

			const res = await refreshToken();
			const response = await res.json();
			if (res.ok) {
				return {
					...token,
					account: {
						...token.account,
						access_token: response.access_token,
						expires_at: response.expires_at,
					},
				};
			}
			return {
				...token,
				error: res.statusText,
			};
		},
		async session({ token, session }) {
			if (token.account.access_token) {
				session.user = token.user;
				session.account = token.account;
			}
			session.error = token.error;

			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};

const setCookies = async (res: Response) => {
	const cookieHeaders = res.headers.get('Set-Cookie');
	if (cookieHeaders) {
		const token = cookieHeaders.split(';')[0].split('=')[1];

		cookies().set({
			name: 'authentication',
			value: token,
			httpOnly: true,
			expires: new Date(jwtDecode(token).exp! * 1000),
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});
	} else {
		cookies().delete('authentication');
		cookies().delete('next-auth.session-token');
	}

	return await res.json();
};
