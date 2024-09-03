'use client';

import axios from 'axios';
import { useState } from 'react';
import { HiPhoto } from 'react-icons/hi2';

interface FileUploadButtonProps {
	onUpload: (result: any) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onUpload }) => {
	const [file, setFile] = useState<any>(null);
	const [uploadUrl, setUploadUrl] = useState<any>(null);

	const handleUpload = async (e: any) => {
		const { data } = await axios.post(`/api/upload`);
		const { url, objectName } = data;

		const newFile = new File([e.target.files[0]], `${objectName}`, {
			type: `${e.target.files[0].type}`,
		});
		setFile(newFile);
		setUploadUrl(url);
		console.log('file', file);

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
				// onUpload(objectName);
				console.log();
			})
			.catch((error) => {
				console.error('Ошибка загрузки файла', error);
				alert('Ошибка загрузки файла');
			});

		alert(`File uploaded: ${file.name}`);
	};

	return (
		<div>
			<label htmlFor='file-input' className='cursor-pointer'>
				<HiPhoto size={30} className='text-sky-500' />
			</label>
			<input
				id='file-input'
				type='file'
				onChange={handleUpload}
				className='hidden'
			/>
		</div>
	);
};

export default FileUploadButton;
