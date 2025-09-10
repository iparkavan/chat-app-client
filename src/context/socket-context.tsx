"use client";

import { HOST } from "@/lib/constants/constsnt";
import { useAuthslice } from "@/store/slices/auth-slice";
import { useChatSlice } from "@/store/slices/chat-slice";
import { MessagesTypes } from "@/types/messages";
import React, { useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const { userInfo } = useAuthslice();

  const host = HOST ?? "http://localhost:4000/";

  useEffect(() => {
    if (userInfo?._id) {
      socket.current = io(host, {
        withCredentials: true,
        transports: ["websocket", "polling"], // ✅ Matches backend
        query: { userId: userInfo._id }, // ✅ Sends userId to backend
      });

      // ✅ Server Socket Connection
      socket.current.on("connect", () => {
        console.log("✅ Connected to socket server:", socket.current?.id);
      });

      // ✅ Handle private messages
      const recieveMessageHandler = (message: MessagesTypes) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addContactInDmContacts,
        } = useChatSlice.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message.sender._id ||
            selectedChatData?._id === message.recipient._id)
        ) {
          addMessage(message);
        }
        addContactInDmContacts(message);
      };

      // ✅ Handle channel messages
      const recieveChannelMessageHandler = (
        message: MessagesTypes & { channel: any }
      ) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addChannelInChannelList,
        } = useChatSlice.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData?._id === message.channel._id
        ) {
          addMessage(message);
        }

        addChannelInChannelList(message);
      };

      // ✅ Typing event
      socket.current.on(
        "typing",
        ({ senderId, firstName, lastName, profileImage }) => {
          const { setTypingUsers, typingUsers } = useChatSlice.getState();

          setTypingUsers({
            ...typingUsers,
            [senderId]: {
              firstName,
              lastName,
              senderId,
              profileImage,
            },
          });
        }
      );

      // ✅ Stop typing event
      socket.current.on("stop-typing", ({ senderId }) => {
        const { typingUsers, setTypingUsers } = useChatSlice.getState();

        const updatedTypingUsers = { ...typingUsers };
        delete updatedTypingUsers[senderId];
        setTypingUsers(updatedTypingUsers);
      });

      // ✅ Register message listeners
      socket.current.on("recieveMessage", recieveMessageHandler);
      socket.current.on(
        "recieve-channel-message",
        recieveChannelMessageHandler
      );

      // ✅ Disconnect cleanup
      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo?._id]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

// "use client";

// import { HOST } from "@/lib/constants/constsnt";
// import { useAuthslice } from "@/store/slices/auth-slice";
// import { useChatSlice } from "@/store/slices/chat-slice";
// import { MessagesTypes } from "@/types/messages";
// import React, { useContext, useEffect, useRef } from "react";
// import { io, Socket } from "socket.io-client";

// const SocketContext = React.createContext<Socket | null>(null);

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const socket = useRef<Socket | null>(null);
//   const { userInfo } = useAuthslice();

//   const host = HOST ?? "http://localhost:4000/";

//   useEffect(() => {
//     if (userInfo) {
//       socket.current = io(host, {
//         withCredentials: true,
//         transports: ["websocket", "polling"], // ✅ Prevents connection issues
//         query: { userId: userInfo._id },
//       });

//       // Server Socket Connection
//       socket.current?.on("connect", () => {
//         console.log("Connected to socket server");
//       });

//       const recieveMessageHandler = (message: MessagesTypes) => {
//         const {
//           selectedChatData,
//           selectedChatType,
//           addMessage,
//           addContactInDmContacts,
//           setTypingUsers,
//           typingUsers,
//         } = useChatSlice.getState();

//         if (
//           selectedChatType !== undefined &&
//           (selectedChatData?._id === message.sender._id ||
//             selectedChatData?._id === message.recipient._id)
//         ) {
//           addMessage(message);
//         }
//         addContactInDmContacts(message);
//       };

//       const recieveChannelMessageHandler = (message: MessagesTypes) => {
//         const {
//           selectedChatData,
//           selectedChatType,
//           addMessage,
//           addChannelInChannelList,
//         } = useChatSlice.getState();

//         if (
//           selectedChatType !== undefined &&
//           selectedChatData?._id === message.channel._id
//         ) {
//           addMessage(message);
//         }

//         addChannelInChannelList(message);
//       };

//       socket.current?.on(
//         "typing",
//         ({ senderId, recipientId, firstName, lastName, profileImage }) => {
//           const { setTypingUsers, typingUsers, selectedChatData } =
//             useChatSlice.getState();

//           setTypingUsers({
//             ...typingUsers,
//             [senderId]: {
//               firstName,
//               // recipientId,
//               senderId,
//               lastName,
//               profileImage,
//             },
//           });
//         }
//       );

//       // Stop typing event handler (removes typing only when "stop-typing" is emitted)
//       socket.current?.on("stop-typing", ({ senderId }) => {
//         const { typingUsers, setTypingUsers } = useChatSlice.getState();

//         const updatedTypingUsers = { ...typingUsers };
//         delete updatedTypingUsers[senderId];

//         setTypingUsers(updatedTypingUsers);
//       });

//       socket.current.on("recieveMessage", recieveMessageHandler);
//       socket.current.on(
//         "recieve-channel-message",
//         recieveChannelMessageHandler
//       );
//       return () => {
//         socket.current?.disconnect();
//       };
//     }
//   }, [userInfo?._id]);

//   return (
//     <SocketContext.Provider value={socket.current}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   return useContext(SocketContext);
// };
