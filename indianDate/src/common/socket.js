import EncryptedStorage from 'react-native-encrypted-storage';
import { io } from 'socket.io-client'

let socket = null;

export const connectToSocketServer = async () => {
	const token = await EncryptedStorage.getItem('token');
	socket = io('http://localhost:8000', {
		auth: {
			token: token
		},
		transports: ['websocket'],
		forceNew: true,
	})
	console.log(socket)
	socket.on('connect', () => {
		console.log("connect successfully", socket.id)
	})

	socket.on('connect_error', (err) => {
		console.log('Connection error:', err.message);
	});
}

export const disconnectFromSocketServer = () => {
	if (socket) {
		socket.disconnect()
	}
}