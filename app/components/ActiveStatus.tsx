import { signOut, useSession } from 'next-auth/react';
import useActiveChannel from '../hooks/useActiveChannel';
import { useCallback, useEffect } from 'react';

const ActiveStatus = () => {
	const { data: session } = useSession();
	const logout = useCallback(async () => {
		await signOut();
	}, []);
	useEffect(() => {
		console.log('logout EXTE');
		if (session?.error === `Unauthorized`) {
			console.log('logout');

			logout();
		}
	}, [session?.error, logout]);
	useActiveChannel();
	return null;
};

export default ActiveStatus;
