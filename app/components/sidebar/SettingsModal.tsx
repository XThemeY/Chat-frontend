'use client';

import { User } from '@/app/lib/@types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Modal from '../Modal';
import Input from '../inputs/Input';
import Button from '../buttons/Button';
import UploadButton from '../buttons/UploadButton';

interface SettingsModalProps {
	currentUser: User | null;
	isOpen: boolean;
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
	currentUser,
	isOpen,
	onClose,
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: currentUser?.name,
			image: currentUser?.image,
		},
	});

	const image = watch('image');
	const handleUpload = (result: string) => {
		setValue('image', result, {
			shouldValidate: true,
		});
	};

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);
		axios
			.post('/api/settings', data)
			.then(() => {
				router.refresh();
				onClose();
			})
			.catch((error) => {
				toast.error('Something went wrong');
			})
			.finally(() => setIsLoading(false));
	};
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='space-y-12'>
					<div className='border-b border-gray-900/10 pb-12'>
						<h2 className='text-base font-semibold leading-7 text-gray-900'>
							Profile
						</h2>
						<p className='mt-1 text-sm leading-6 text-gray-600'>
							Enter your public information
						</p>
						<div className='mt-10 flex flex-col gap-y-8'>
							<Input
								disabled={isLoading}
								id='name'
								label='Name'
								errors={errors}
								register={register}
								required
							/>
							<div>
								<label
									htmlFor='settings-avatar-input'
									className='block text-sm font-medium leading-6 text-gray-900'>
									Photo
								</label>
								<div className='mt-2 flex items-center gap-x-3'>
									<Image
										className='rounded-full'
										height={48}
										width={48}
										style={{ width: 48, height: 48 }}
										src={
											image || currentUser?.image || '/images/placeholder.webp'
										}
										alt='Avatar'
									/>
									<UploadButton
										inputId='settings-avatar-input'
										onUpload={handleUpload}
										type='button'
										secondary
										disabled={isLoading}>
										Change
									</UploadButton>
								</div>
							</div>
						</div>
					</div>
					<div className='mt-6 flex items-center justify-end gap-x-6'>
						<Button
							type='button'
							secondary
							onClick={onClose}
							disabled={isLoading}>
							Cancel
						</Button>
						<Button type='submit' disabled={isLoading}>
							Save
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
};

export default SettingsModal;
