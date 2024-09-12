'use client';

import { User } from '../lib/@types';
import { Avatar as AvatarUi } from '@nextui-org/avatar';
interface AvatarGroupProps {
	users?: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
	const slicedUsers = users.slice(0, 3);

	const positionMap = {
		0: 'top-0 left-[12px]',
		1: 'bottom-0',
		2: 'bottom-0 right-0',
	};

	return (
		<div className='relative h-11 w-11'>
			{slicedUsers.map((user, index) => (
				<div
					key={user.id}
					className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
						positionMap[index as keyof typeof positionMap]
					} `}>
					<AvatarUi
						key={user.id}
						src={user?.image ?? '/images/placeholder.webp'}
						alt='Avatar'
						name={user?.name}
					/>
				</div>
			))}
		</div>
	);
};

export default AvatarGroup;
