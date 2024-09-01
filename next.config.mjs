/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: 'avatar.iran.liara.run' },
			{ hostname: 'avatars.mds.yandex.net' },
			{ hostname: 'res.cloudinary.com' },
			{ hostname: 'lh3.googleusercontent.com' },
		],
	},
};

export default nextConfig;
