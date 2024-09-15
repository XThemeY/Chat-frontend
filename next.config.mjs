/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: 'avatar.iran.liara.run' },
			{ hostname: 'avatars.mds.yandex.net' },
			{ hostname: 'ui-avatars.com' },
			{ hostname: 'res.cloudinary.com' },
			{ hostname: 'lh3.googleusercontent.com' },
			{ hostname: 'xthemey.ru' },
		],
	},
	output: 'standalone',
};

export default nextConfig;
