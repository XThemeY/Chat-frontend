import getUsers from '../actions/getUsers';
import Sidebar from '../components/sidebar/Sidebar';
import UserList from './components/UserList';

export default async function UsersLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const users = await getUsers();

	return (
		<Sidebar>
			<UserList users={users} />
			<div className='h-full'>{children}</div>
		</Sidebar>
	);
}
