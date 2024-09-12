'use client';

import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import ToasterContext from '../context/ToasterContext';
import AuthContext from '../context/AuthContext';
import ActiveStatus from './ActiveStatus';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<AuthContext>
			{children}
			<ToasterContext />
			<ActiveStatus />
			<NextTopLoader />
		</AuthContext>
	);
};

export default Providers;
