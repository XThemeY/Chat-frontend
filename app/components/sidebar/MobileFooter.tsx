'use client';

import useConversation from '@/app/hooks/useConversation';
import useRoutes from '@/app/hooks/useRoutes';
import MobileItem from './MobileItem';
import SettingsModal from './SettingsModal';
import { useState } from 'react';
import { HiUser } from 'react-icons/hi2';
import { User } from '@/app/lib/@types';

interface DesktopSidebarProps {
	currentUser: User | null;
}

const MobileFooter: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
	const routes = useRoutes();
	const { isOpen } = useConversation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	if (isOpen) {
		return null;
	}

	return (
		<>
			<SettingsModal
				currentUser={currentUser}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<div className='fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden'>
				<MobileItem
					key={'Profile'}
					href={'#'}
					icon={HiUser}
					onClick={() => setIsModalOpen(true)}
				/>
				{routes.map((route) => (
					<MobileItem
						key={route.label}
						href={route.href}
						icon={route.icon}
						active={route.active}
						onClick={route.onClick}
					/>
				))}
			</div>
		</>
	);
};

export default MobileFooter;
