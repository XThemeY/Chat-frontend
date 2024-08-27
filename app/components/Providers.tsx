'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import ToasterContext from '../context/ToasterContext';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<>
			<SessionProvider>{children}</SessionProvider>
			<NextTopLoader />
			<ToasterContext />
		</>
	);
};

export default Providers;
