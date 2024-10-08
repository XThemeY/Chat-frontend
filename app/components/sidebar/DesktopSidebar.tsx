'use client';

import useRoutes from '@/app/hooks/useRoutes';
import { useState } from 'react';
import DesktopItem from './DesktopItem';
import Avatar from '../Avatar';
import { User } from '@/app/lib/@types';
import SettingsModal from './SettingsModal';

interface DesktopSidebarProps {
	currentUser: User | null;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
	const routes = useRoutes();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<SettingsModal
				currentUser={currentUser}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
			<div className='hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-whit lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between'>
				<nav className='mt-4 flex flex-col justify-between'>
					<ul className='flex flex-col items-center space-y-1'>
						{routes.map((route) => (
							<DesktopItem
								key={route.label}
								href={route.href}
								label={route.label}
								icon={route.icon}
								active={route.active}
								onClick={route.onClick}
							/>
						))}
					</ul>
				</nav>

				<nav className='mt-4 flex flex-col justify-between items-center'>
					<button
						onClick={() => setIsOpen(!isOpen)}
						className='hover:opacity-75 transition'>
						<Avatar user={currentUser} />
					</button>
				</nav>
			</div>
		</>
	);
};

export default DesktopSidebar;
