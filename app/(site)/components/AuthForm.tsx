'use client';

import Input from '@/app/components/inputs/Input';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGoogle } from 'react-icons/bs';
import { IoLogoVk } from 'react-icons/io5';
import { FaYandex } from 'react-icons/fa';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/buttons/Button';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
	const session = useSession();

	const router = useRouter();
	const [variant, setVariant] = useState<Variant>('LOGIN');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (session?.status === 'authenticated') {
			router.push('/users');
		}
	}, [session?.status, router]);

	const toggleVariant = useCallback(() => {
		if (variant === 'LOGIN') {
			setVariant('REGISTER');
		} else {
			setVariant('LOGIN');
		}
	}, [variant]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			login: '',
			// email: '',
			password: '',
			confirmPassword: '',
			type: 'credentials',
			provider: 'credentials',
		},
	});

	const credSignIn = async (data: FieldValues) => {
		signIn('credentials', { ...data, redirect: false })
			.then((callback) => {
				if (callback?.error) {
					toast.error('Invalid credentials');
				}
				if (callback?.ok) {
					toast.success('Successfully logged in');

					router.push('/users');
				}
			})
			.finally(() => setIsLoading(false));
	};

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);

		if (variant === 'REGISTER') {
			axios
				.post('/api/register', data)
				.then(async () => {
					credSignIn(data);
				})
				.catch((error) => {
					toast.error(error.response.data);
				})
				.finally(() => setIsLoading(false));
		}

		if (variant === 'LOGIN') {
			credSignIn(data);
		}
	};

	const socialAction = async (action: string) => {
		setIsLoading(true);

		signIn(action, { redirect: false })
			.then((callback) => {
				if (callback?.error) {
					toast.error('Invalid credentials');
				}
				if (callback?.ok) {
					toast.success('Successfully logged in');
				}
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
			<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
				<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
					{variant === 'REGISTER' && (
						<Input
							id='name'
							label='Name'
							type='text'
							register={register}
							errors={errors}
							disabled={isLoading}
						/>
					)}
					<Input
						id='login'
						label='Login'
						type='text'
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<Input
						id='password'
						label='Password'
						type='password'
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<Input
						id='confirmPassword'
						label='Confirm Password'
						type='password'
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<Button disabled={isLoading} fullWidth type='submit'>
						{variant === 'LOGIN' ? 'Sign in' : 'Register'}
					</Button>
				</form>
				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-white text-gray-500'>
								Or continue with
							</span>
						</div>
					</div>
					<div className='mt-6 flex gap-2'>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => socialAction('google')}
						/>
						<AuthSocialButton
							icon={FaYandex}
							onClick={() => socialAction('yandex')}
						/>
						{/* <AuthSocialButton
							icon={IoLogoVk}
							onClick={() => socialAction('vk')}
						/> */}
					</div>
				</div>
				<div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
					<div>
						{variant === 'LOGIN'
							? 'New to Messenger?'
							: 'Already have an account?'}
					</div>
					<button onClick={toggleVariant} className='underline cursor-pointer'>
						{variant === 'LOGIN' ? 'Create an account' : 'Login'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
