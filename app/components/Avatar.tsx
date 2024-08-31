'use client';

import Image from 'next/image';
import { User } from '../lib/@types/users';

interface AvatarProps {
	user?: User | null;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
	return (
		<div className='relative'>
			<div className='relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
				<Image
					alt='Avatar'
					src={user?.image ?? 'images/user-placeholder.webp'}
					fill
					sizes='md:h-11, md:w-11, h-9, w-9'
				/>
			</div>
		</div>
	);
};

export default Avatar;
