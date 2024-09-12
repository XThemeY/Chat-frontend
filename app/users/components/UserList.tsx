'use client';

import { User } from '@/app/lib/@types';
import UserBox from './UserBox';

interface UserListProps {
	users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
	return (
		<aside className='fixed inset-y-0 pb-20 lg:pb-0 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full'>
			<div className='px-5'>
				<div className='flex-col'>
					<div className='text-2xl font-bold text-neutral-800 py-4'>People</div>
				</div>
				{users
					? users.map((user) => <UserBox key={user.id} data={user} />)
					: null}
			</div>
		</aside>
	);
};

export default UserList;
