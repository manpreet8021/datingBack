const connectedUsersUsingSocketId = new Map();
const connectedUsersUsingUserId = new Map();

let io = null

export const setSocketServerInstance = (ioInstance) => {
	io = ioInstance;
};

export const getSocketServerInstance = () => {
	return io;
};

export const addNewConnectedUser = ({ socketId, userId }) => {
	connectedUsersUsingSocketId.set(socketId, { userId });
	connectedUsersUsingUserId.set(userId, socketId)
	console.log("new connected users");
	console.log(connectedUsersUsingSocketId);
};

export const removeConnectedUser = (socketId) => {
	if (connectedUsersUsingSocketId.has(socketId)) {
		console.log("here")
		connectedUsersUsingSocketId.delete(socketId);
	}
};

export const getActiveConnections = (userId) => {
	const activeConnections = [];

	connectedUsersUsingSocketId.forEach(function (value, key) {
		if (value.userId === userId) {
			activeConnections.push(key);
		}
	});

	return activeConnections;
};

export const getOnlineUsers = () => {
	const onlineUsers = [];

	connectedUsersUsingSocketId.forEach((value, key) => {
		onlineUsers.push({ socketId: key, userId: value.userId });
	});

	return onlineUsers;
};