'use client';

import { Toaster } from 'react-hot-toast';

const ToasterContext = () => {
	return (
		<Toaster
			// position='bottom-right'
			toastOptions={{
				success: {
					className: `border-2 border-green-500`,
				},
				error: {
					className: `border-2 border-rose-500`,
				},
				loading: {
					className: `border-2 border-yellow-500`,
				},
			}}
		/>
	);
};

export default ToasterContext;
