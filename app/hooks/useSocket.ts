import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = () => {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		const socketInstance = io(
			process.env.SOCKET_URL ?? 'http://xthemey.ru:3000',
			{
				transports: ['websocket'],
				auth: {
					token: process.env.SOCKET_AUTH_TOKEN ?? '',
				},
			}
		);

		setSocket(socketInstance);
		// Отключение WebSocket при размонтировании компонента
		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return socket as Socket;
};

export default useSocket;
