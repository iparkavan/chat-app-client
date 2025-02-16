"use client";

import { HOST } from "@/lib/constants/constsnt";
import { useAuthslice } from "@/store/slices/auth-slice";
import { useChatSlice } from "@/store/slices/chat-slice";
import { MessagesTypes } from "@/types/messages";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const { userInfo } = useAuthslice();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      // Server Socket Connection
      socket.current?.on("connect", () => {
        console.log("Connected to socket server");
      });

      const recieveMessageHandler = (message: MessagesTypes) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useChatSlice.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message.sender._id ||
            selectedChatData?._id === message.recipient._id)
        ) {
          console.log("Message Received", message);
          addMessage(message);
        }
      };

      socket.current.on("recieveMessage", recieveMessageHandler);
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
