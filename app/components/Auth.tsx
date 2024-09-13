import { useSession } from 'next-auth/react';
import React from 'react';

export default function Auth({ children }: { children: React.ReactNode }) {
	const { status } = useSession();
	if (status === 'loading') {
		return;
	}

	return children;
}
