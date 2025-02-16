"use client";

import { Button } from "@/components/ui/button";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import { useChatSlice } from "@/store/slices/chat-slice";
import { useSocket } from "@/context/socket-context";
import { useAuthslice } from "@/store/slices/auth-slice";
import { Input } from "@/components/ui/input";
import { axios } from "@/lib/axios";
import { UPLOAD_FILE_ROUTE } from "@/lib/api-routes";
import { AxiosProgressEvent } from "axios";

const ChatForm = () => {
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const socket = useSocket();

  const {
    selectedChatData,
    selectedChatType,
    setIsUploading,
    setFileUploadProgress,
  } = useChatSlice();
  const { userInfo } = useAuthslice();

  const [message, setMessage] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);

  //useEffect to Close the Emoji Component
  useEffect(() => {
    const clickOutsideHandler = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setIsEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [emojiRef]);

  // Handling the Emojies
  const emojiHandler = (emoji: { emoji: string }) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  // Function for sending the messages
  const sendMessageHandler = (e: FormEvent) => {
    e.preventDefault();
    if (selectedChatType === "contact") {
      socket?.emit("sendMessage", {
        sender: userInfo?.id,
        content: message,
        recipient: selectedChatData?._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }

    setMessage("");
  };

  const attachmentClickHanlder = () => {
    if (fileInputRef) {
      fileInputRef.current?.click();
    }
  };

  const attachmentChangeHandler = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      // console.log(file);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        const response = await axios.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data: AxiosProgressEvent) => {
            if (data && data.total) {
              setFileUploadProgress(
                Math.round((100 * data.loaded) / data.total)
              );
            }
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket?.emit("sendMessage", {
              sender: userInfo?.id,
              content: undefined,
              recipient: selectedChatData?._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-start gap-2 p-1 relative">
      <div className="flex items-center justify-center gap-1">
        <Button
          variant={"ghost"}
          type="submit"
          size={"icon"}
          className="text-muted-foreground"
          onClick={attachmentClickHanlder}
        >
          <GrAttachment className="text-xl" />
        </Button>
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={attachmentChangeHandler}
        />
        <Button
          variant={"ghost"}
          type="submit"
          size={"icon"}
          className="text-muted-foreground"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
        >
          <RiEmojiStickerLine className="text-xl" />
        </Button>

        {/* Emoji Picker Code */}
        <div className="absolute bottom-16 left-0" ref={emojiRef}>
          <EmojiPicker
            theme={theme as Theme}
            open={isEmojiPickerOpen}
            onEmojiClick={emojiHandler}
            autoFocusSearch={false}
          />
        </div>
      </div>
      <form className="w-full flex items-center" onSubmit={sendMessageHandler}>
        <input
          className="flex w-full rounded-md bg-transparent px-3 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          value={message}
          placeholder="Type a message"
        />
        <Button
          variant={"ghost"}
          type="submit"
          size={"icon"}
          className="text-white bg-primary"
        >
          <IoSend className="text-xl" />
        </Button>
      </form>
      <div></div>
    </div>
  );
};

export default ChatForm;
