import { io } from "socket.io-client";

// process.env.REACT_APP_SocialMedia_URL ||
console.log(process.env.REACT_APP_SocialMedia_URL);
const socket = io(process.env.REACT_APP_SocialMedia_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50,
  transports: ["websocket"],
});

export default socket;
