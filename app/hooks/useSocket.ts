import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = () => {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		const socketInstance = io('http://wasted-chat.ru:3000', {
			transports: ['websocket'],
			auth: {
				token: 'abc',
			},
		});

		setSocket(socketInstance);
		// Отключение WebSocket при размонтировании компонента
		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return socket as Socket;
};

export default useSocket;
