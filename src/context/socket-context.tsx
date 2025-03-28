"use client";

import { HOST } from "@/lib/constants/constsnt";
import { useAuthslice } from "@/store/slices/auth-slice";
import { useChatSlice } from "@/store/slices/chat-slice";
import { MessagesTypes } from "@/types/messages";
import { Lasso } from "lucide-react";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const { userInfo } = useAuthslice();

  const host = HOST ?? "default_host_value";
  console.log("Socket connecting to:", host);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(host, {
        withCredentials: true,
        transports: ["websocket", "polling"], // ✅ Prevents connection issues
        query: { userId: userInfo.id },
      });

      // Server Socket Connection
      socket.current?.on("connect", () => {
        console.log("Connected to socket server");
      });

      const recieveMessageHandler = (message: MessagesTypes) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addContactInDmContacts,
          setTypingUsers,
          typingUsers,
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

      const recieveChannelMessageHandler = (message: MessagesTypes) => {
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

      socket.current?.on(
        "typing",
        ({ senderId, recipientId, firstName, lastName, profileImage }) => {
          const { setTypingUsers, typingUsers, selectedChatData } =
            useChatSlice.getState();

          setTypingUsers({
            ...typingUsers,
            [senderId]: {
              firstName,
              // recipientId,
              senderId,
              lastName,
              profileImage,
            },
          });
        }
      );

      // Stop typing event handler (removes typing only when "stop-typing" is emitted)
      socket.current?.on("stop-typing", ({ senderId }) => {
        const { typingUsers, setTypingUsers } = useChatSlice.getState();

        const updatedTypingUsers = { ...typingUsers };
        delete updatedTypingUsers[senderId];

        setTypingUsers(updatedTypingUsers);
      });

      socket.current.on("recieveMessage", recieveMessageHandler);
      socket.current.on(
        "recieve-channel-message",
        recieveChannelMessageHandler
      );
      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo?.id]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
