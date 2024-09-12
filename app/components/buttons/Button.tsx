'use client';
import { Button as ButtonUi } from '@nextui-org/button';
import clsx from 'clsx';

interface ButtonProps {
	type: 'button' | 'submit' | 'reset' | undefined;
	fullWidth?: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
	secondary?: boolean;
	danger?: boolean;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	type,
	fullWidth,
	children,
	onClick,
	secondary,
	danger,
	disabled,
}) => {
	return (
		<ButtonUi
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={clsx(
				`flex justify-center rounded-md px-2 py-2 text-sm min-w-0 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-inherit`,
				disabled && 'opacity-50 cursor-default',
				fullWidth && 'w-full',
				secondary ? 'text-gray-900' : 'text-white',
				danger &&
					'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
				!secondary &&
					!danger &&
					'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'
			)}>
			{children}
		</ButtonUi>
	);
};

export default Button;
