'use client';

import { User } from '../lib/@types/user';
import useActiveList from '../hooks/useActiveList';
import { useSession } from 'next-auth/react';
import { Avatar as AvatarUi } from '@nextui-org/avatar';
interface AvatarProps {
	user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
	const { members } = useActiveList();
	const session = useSession();
	const isActive = members.indexOf(user?.id as string) !== -1;
	const isOwn = session?.data?.user?.id === user?.id;
	const name = user?.name ?? 'Anonymous';
	return (
		<div className='relative'>
			<div className='relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
				<AvatarUi
					name={name}
					alt='Avatar'
					src={user?.image ?? '/images/placeholder.webp'}
				/>
			</div>
			{isActive && !isOwn && (
				<span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3' />
			)}
		</div>
	);
};

export default Avatar;
