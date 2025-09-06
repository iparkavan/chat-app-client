import { useAuthslice } from "@/store/slices/auth-slice";
import { useChatSlice } from "@/store/slices/chat-slice";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import moment from "moment";
import { MessagesTypes } from "@/types/messages";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { GET_CHANNEL_MESSAGES, GETALLMESSAGESROUTES } from "@/lib/api-routes";
import Image from "next/image";
import { bgColors, HOST } from "@/lib/constants/constsnt";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { AxiosProgressEvent } from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ChatArea = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { userInfo } = useAuthslice();
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useChatSlice();

  // useEffect to fetch all messages of the users
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.post(
          GETALLMESSAGESROUTES,
          {
            user2: selectedChatData?._id,
          },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error: any) {
        toast("Unable to fetch Messages");
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await axios.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData?._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error: any) {
        toast("Unable to fetch Messages");
      }
    };

    if (selectedChatData?._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // useEffect for scroll to view bottom when selectedChatMessages changed
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // To Check if it is image
  const checkIfImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url: string) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);

      const response = await axios.get(`${HOST}/${url}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          const { loaded, total } = progressEvent;
          if (total) {
            const percentCompleted = Math.round((loaded * 100) / total);
            setFileDownloadProgress(percentCompleted);
          }
        },
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop() as string);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      console.log(error);
    }
  };

  // Function for rendering all the message types
  const renderMessages = (): JSX.Element | null => {
    let lastDate: string | null = null;
    return selectedChatMessages?.map(
      (message: MessagesTypes, index: number) => {
        const messageDate = moment(message.timestamp).format("YYYY-MM-DD"); // Corrected here
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <div key={index}>
            {showDate && (
              <div className="text-center text-muted-foreground my-2">
                {moment(message.timestamp).format("LL")}
              </div>
            )}
            {selectedChatType === "contact" && renderDirectMessage(message)}
            {selectedChatType === "channel" && renderChannelMessage(message)}
          </div>
        );
      }
    );
  };

  // Function for direct contact messages
  const renderDirectMessage = (message: MessagesTypes): JSX.Element | null => (
    <div
      className={cn(
        message.sender === selectedChatData?._id ? "text-left" : "text-right"
      )}
    >
      {/* To Display For Text */}
      {message.messageType === "text" && (
        <div
          className={cn(
            `inline-block p-2 rounded-2xl my-1 max-w-[50%] break-words drop-shadow-md`,
            message.sender !== selectedChatData?._id
              ? "bg-[#d9fdd3] text-black text-left dark:bg-[#005c4b] dark:text-white"
              : "bg-gray-100 text-black dark:bg-[#353535] dark:text-white"
          )}
        >
          {message.content}
          <div className="text-xs text-muted-foreground text-end">
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      )}

      {/* To Display For FileType */}
      {message.messageType === "file" && (
        <div
          className={cn(
            `inline-block p-2 rounded-2xl my-1 max-w-[50%] break-words truncate drop-shadow-md`,
            message.sender !== selectedChatData?._id
              ? "bg-[#d9fdd3] text-white dark:bg-[#005c4b] dark:text-white"
              : "bg-gray-100 text-black dark:bg-[#353535] dark:text-white"
          )}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer rounded-md"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <Image
                className="rounded-lg"
                src={`${HOST}/${message.fileUrl}`}
                alt="fileUrl"
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              {/* {isDownloading && (
                <p className="text-lg">{fileDownloadProgress}%</p>
              )} */}
              <span className="bg-muted-foreground rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()?.substring(0, 12)}</span>
              <span
                className="bg-black rounded-full p-3 hover:bg-muted-foreground cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      {/* <div className="text-xs px-3 text-muted-foreground">
        {moment(message.timestamp).format("LT")}
      </div> */}
    </div>
  );

  const renderChannelMessage = (message: MessagesTypes): JSX.Element | null => {
    const isSender =
      (message.sender as unknown as { _id: string })._id === userInfo?.id;
    const profileImage = message?.sender?.profileImage;
    const bgColor = bgColors[message?.sender?.bgColor as number];
    const initials =
      message?.sender?.firstName && message?.sender?.lastName
        ? `${message.sender.firstName.charAt(
            0
          )}${message.sender.lastName.charAt(0)}`
        : userInfo?.email?.charAt(0);

    return (
      <div
        className={cn(
          "flex w-full items-end gap-2",
          isSender ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar for Receiver */}
        {!isSender && (
          <div className="flex-shrink-0">
            {profileImage ? (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`${HOST}/${profileImage}`}
                  alt="profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </Avatar>
            ) : (
              <div
                className="h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: bgColor, transition: "all .3s" }}
              >
                {initials}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div
          className={cn(
            "flex",
            isSender ? "justify-end" : "justify-start",
            "w-full"
          )}
        >
          {message.messageType === "text" && (
            <div
              className={cn(
                "inline-block p-1.5 rounded-xl my-1 max-w-[60%] break-words",
                isSender
                  ? "bg-[#d9fdd3] text-black dark:bg-[#005c4b] dark:text-white"
                  : "bg-gray-100 text-black dark:bg-[#353535] dark:text-white"
              )}
            >
              {!isSender && (
                <div
                  style={{ color: bgColor }}
                  className="text-sm font-semibold"
                >
                  ~{message.sender.firstName} {message.sender.lastName}
                </div>
              )}
              {message.content}
              {/* Timestamp */}
              <div className="text-xs text-end mt-1 text-muted-foreground">
                {moment(message.timestamp).format("LT")}
              </div>
            </div>
          )}
          {message.messageType === "file" && (
            <div
              className={cn(
                `inline-block p-2 rounded-2xl my-1 max-w-[50%] break-words truncate drop-shadow-md`,
                (message.sender as unknown as { _id: string })._id ===
                  userInfo?.id
                  ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-black dark:text-white"
                  : "bg-gray-100 text-black dark:bg-[#353535] dark:text-white"
              )}
            >
              {!isSender && (
                <div
                  style={{ color: bgColor }}
                  className="text-sm p-1 font-semibold"
                >
                  ~{message.sender.firstName} {message.sender.lastName}
                </div>
              )}
              {checkIfImage(message.fileUrl) ? (
                <div
                  className="cursor-pointer rounded-md"
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}
                >
                  <Image
                    className="rounded-lg"
                    src={`${HOST}/${message.fileUrl}`}
                    alt="fileUrl"
                    height={300}
                    width={300}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  {/* {isDownloading && (
                <p className="text-lg">{fileDownloadProgress}%</p>
              )} */}
                  <span className="bg-muted-foreground rounded-full p-3">
                    <MdFolderZip />
                  </span>
                  <span>
                    {message.fileUrl.split("/").pop()?.substring(0, 12)}
                  </span>
                  <span
                    className="bg-black rounded-full p-3 hover:bg-muted-foreground cursor-pointer transition-all duration-300"
                    onClick={() => downloadFile(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty space for sender messages (Ensures correct right alignment) */}
        {isSender && <div className="w-8" />}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-7rem)] overflow-y-auto w-full">
      <div className="mx-8 my-2">
        {renderMessages()}
        <div ref={scrollRef} />

        {showImage && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-lg">
            {/* Image Container */}
            <div className="relative w-[90vw] max-w-3xl h-[80vh] flex flex-col items-center justify-center">
              <Image
                className="rounded-lg object-contain"
                src={`${HOST}/${imageUrl}`}
                fill
                alt="fileUrl"
              />

              {/* Close & Download Buttons */}
              <div className="absolute top-5 right-5 flex gap-3">
                <Button
                  className="bg-black/30 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300"
                  onClick={() => downloadFile(imageUrl as string)}
                >
                  <IoMdArrowRoundDown />
                </Button>
                <Button
                  className="bg-black/30 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300"
                  onClick={() => {
                    setShowImage(false);
                    setImageUrl(null);
                  }}
                >
                  <IoCloseSharp />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
