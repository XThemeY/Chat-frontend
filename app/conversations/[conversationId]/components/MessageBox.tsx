'use client';

import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/lib/@types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Image } from '@nextui-org/image';
import { useState } from 'react';
import ImageModal from './ImageModal';

interface MessageBoxProps {
	data: FullMessageType;
	isLast?: boolean;
	bottomRef: React.RefObject<HTMLDivElement>;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast, bottomRef }) => {
	const session = useSession();
	const [imageModalOpen, setImageModalOpen] = useState(false);

	const isOwn = session?.data?.user?.id === data?.sender?.id;
	const seenList = (data?.seen || [])
		.filter((user) => user.id !== data?.sender?.id)
		.map((user) => user.name)
		.join(', ');

	const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
	const avatar = clsx(isOwn && 'order-2');
	const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
	const message = clsx(
		'text-sm w-fit overflow-hidden',
		isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
		data.image ? 'rounded-md p-0' : 'rounded-2xl py-2 px-3'
	);
	return (
		<div className={container} ref={isLast ? bottomRef : null}>
			<div className={avatar}>
				<Avatar user={data.sender} />
			</div>
			<div className={body}>
				<div className='flex items-center gap-1'>
					<div className='text-sm text-gray-500'>{data.sender.name}</div>
					<div className='text-xs text-gray-400'>
						{format(new Date(data.createdAt), 'HH:mm')}
					</div>
				</div>
				<div className={message}>
					<ImageModal
						src={data.image}
						isOpen={imageModalOpen}
						onClose={() => setImageModalOpen(false)}
					/>

					{data.image ? (
						<Image
							onClick={() => setImageModalOpen(true)}
							alt='Image'
							width={288}
							height={288}
							src={data.image}
							className='object-cover cursor-pointer hover:scale-110 transition translate'
						/>
					) : (
						<div className='max-w-xs break-words'>{data.body}</div>
					)}
				</div>
				{isLast && isOwn && seenList.length > 0 && (
					<div className='text-xs font-light text-gray-500'>{`Seen by ${seenList}`}</div>
				)}
			</div>
		</div>
	);
};

export default MessageBox;
