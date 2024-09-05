'use client';

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import UploadButton from '@/app/components/buttons/UploadButton';

const Form = () => {
	const { conversationId } = useConversation();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FieldValues>({ defaultValues: { message: '' } });

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setValue('message', '', { shouldValidate: true });
		axios.post(`/api/messages`, {
			...data,
			conversationId,
		});
	};

	const handleUpload = (result: string) => {
		axios.post(`/api/messages`, {
			image: result,
			conversationId,
		});
	};

	return (
		<div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
			<UploadButton
				onUpload={handleUpload}
				inputId='msgs-file-input'
				type='button'
				secondary>
				<HiPhoto size={30} className='text-sky-500' />
			</UploadButton>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex items-center gap-2 lg:gap-4 w-full'>
				<MessageInput
					id='message'
					register={register}
					errors={errors}
					required
					placeholder='Write a message'
				/>
				<button
					type='submit'
					className='bg-sky-500 hover:bg-sky-600 p-2 rounded-full transition'>
					<HiPaperAirplane size={18} className='text-white' />
				</button>
			</form>
		</div>
	);
};

export default Form;
