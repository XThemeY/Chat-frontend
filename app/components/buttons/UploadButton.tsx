'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from './Button';

interface UploadButtonProps {
	inputId: string;
	onUpload: (result: string) => void;
	type: 'button' | 'submit' | 'reset' | undefined;
	fullWidth?: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
	secondary?: boolean;
	danger?: boolean;
	disabled?: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
	inputId,
	onUpload,
	children,
	type,
	fullWidth,
	onClick,
	secondary,
	danger,
	disabled,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [uploadUrl, setUploadUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!uploadUrl || !file) {
			return;
		}
		axios
			.put(uploadUrl, file, {
				onUploadProgress: (progressEvent) =>
					console.log(
						Math.round((progressEvent.loaded / progressEvent.total!) * 100) +
							'%'
					),
				headers: {
					'Content-Type': file.type,
				},
			})
			.then(() => {
				const fileURL = 'http://xthemey.ru:9000/xthemey-chat/' + file.name;
				onUpload(fileURL);
			})
			.catch((error) => {
				console.error('Ошибка загрузки файла', error);
				alert('Ошибка загрузки файла');
			});
		setFile(null);
		setUploadUrl(null);
	}, [file, uploadUrl, onUpload]);

	const handleUpload = async (e: any) => {
		const { data } = await axios.get(`/api/upload`);
		const { url, objectName } = data;

		const newFile = new File([e.target.files[0]], `${objectName}`, {
			type: `${e.target.files[0].type}`,
		});

		setFile(newFile);
		setUploadUrl(url);
	};

	return (
		<Button
			onClick={onClick}
			type={type}
			disabled={disabled}
			secondary={secondary}>
			<label htmlFor={inputId} className='cursor-pointer'>
				{children}
			</label>
			<input
				id={inputId}
				type='file'
				onChange={handleUpload}
				className='hidden'
			/>
		</Button>
	);
};

export default UploadButton;
