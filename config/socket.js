import { Server } from "socket.io";
import { setSocketServerInstance, getOnlineUsers } from './socketStore.js'
import { protectSocket } from "../middleware/authMiddleware.js";
import { addNewConnectedUser, removeConnectedUser } from "./socketStore.js";

export const registerSocketServer = (server) => {
	const io = new Server(server, {
		cors: { origin: "*", methods: ['GET', 'POST'] },
	});


	setSocketServerInstance(io)

	io.use((socket, next) => {
		protectSocket(socket, next);
	});

	const emitOnlineUsers = () => {
		const onlineUsers = getOnlineUsers();
		io.emit("online-users", { onlineUsers });
	};

	io.on("connection", (socket) => {
		console.log("user connected");
		console.log(socket.id);

		const userDetails = socket.user;
		console.log(userDetails.dataValues.id)
		addNewConnectedUser({
			socketId: socket.id,
			userId: userDetails.dataValues.id,
		});

		// emitOnlineUsers();

		// socket.on("direct-message", (data) => {
		//   // directMessageHandler(socket, data);
		// });

		// socket.on("direct-chat-history", (data) => {
		//   // directChatHistoryHandler(socket, data);
		// });

		socket.on("disconnect", () => {
		  removeConnectedUser(socket.id)
		});
	});

	setInterval(() => {
		emitOnlineUsers();
	}, [1000 * 8]);
}