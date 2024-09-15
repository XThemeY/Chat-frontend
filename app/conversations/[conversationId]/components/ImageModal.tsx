'use client';

import Modal from '@/app/components/Modal';
import { Image } from '@nextui-org/image';

interface ImageModalProps {
	src?: string | null;
	isOpen?: boolean;
	onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
	if (!src) return null;
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<Image
				className='object-cover z-0 '
				alt='Image'
				width={700}
				height={700}
				src={src}
				style={{ width: 'auto', height: '100%' }}
			/>
		</Modal>
	);
};

export default ImageModal;
