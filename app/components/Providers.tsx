'use client';

import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import ToasterContext from '../context/ToasterContext';
import AuthContext from '../context/AuthContext';
import ActiveStatus from './ActiveStatus';
import Auth from './Auth';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<AuthContext>
			<Auth>
				{children}
				<ToasterContext />
				<ActiveStatus />
				<NextTopLoader />
			</Auth>
		</AuthContext>
	);
};

export default Providers;
