import type { Metadata } from 'next';
import './globals.css';
import Providers from './components/Providers';

export const metadata: Metadata = {
	title: 'XThemeY Messenger',
	description: 'XThemeY Messenger',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
