'use client';

import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import ToasterContext from '../context/ToasterContext';
import AuthContext from '../context/AuthContext';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<AuthContext>
			{children}
			<ToasterContext />
			<NextTopLoader />
		</AuthContext>
	);
};

export default Providers;
