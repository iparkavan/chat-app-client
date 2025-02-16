import { useAuthslice } from "@/store/slices/auth-slice";
import { useChatSlice } from "@/store/slices/chat-slice";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import moment from "moment";
import { MessagesTypes } from "@/types/messages";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { GETALLMESSAGESROUTES } from "@/lib/api-routes";
import Image from "next/image";
import { HOST } from "@/lib/constants/constsnt";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import { AxiosProgressEvent } from "axios";

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
        console.log(error.message);
        toast("Unable to fetch Messages");
      }
    };

    if (selectedChatData?._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // useEffect for scroll to view bottom when selectedChatMessages changed
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  console.log(selectedChatMessages);

  // To Check if it is image
  const checkIfImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  // const downloadFile = async (url: string) => {
  //   try {
  //     setIsDownloading(true);
  //     setFileDownloadProgress(0);
  //     const response = await axios.get(`${HOST}/${url}`, {
  //       responseType: "blob",
  //       onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
  //         const { loaded, total } = progressEvent;
  //         if (total) {
  //           const percentCompleted = Math.round((loaded * 100) / total);
  //           setFileDownloadProgress(percentCompleted);
  //         }
  //       },
  //     });

  //     setIsDownloading(false);
  //   } catch (error) {
  //     setIsDownloading(false);
  //     console.log(error);
  //   }

  //   const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement("a");
  //   link.href = urlBlob;
  //   link.setAttribute("download", url.split("/").pop() as string);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  //   window.URL.revokeObjectURL(urlBlob);
  // };

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
            `inline-block p-2 rounded-2xl my-1 max-w-[50%] break-words`,
            message.sender !== selectedChatData?._id
              ? "bg-primary text-white dark:bg-primary dark:text-black"
              : "bg-primary-foreground text-primary dark:text-primary"
          )}
        >
          {message.content}
        </div>
      )}

      {/* To Display For FileType */}
      {message.messageType === "file" && (
        <div
          className={cn(
            `inline-block p-2 rounded-2xl my-1 max-w-[50%] break-words truncate`,
            message.sender !== selectedChatData?._id
              ? "bg-primary text-white dark:bg-primary dark:text-black"
              : "bg-primary-foreground text-primary dark:text-primary"
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
      <div className="text-xs px-3 text-muted-foreground">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="h-[88vh] overflow-y-scroll w-full">
      <div className="mx-8 my-2">
        {renderMessages()}
        <div ref={scrollRef} />
        {showImage && (
          <div className="fixed z-10 top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg">
            <div className="w-[80vw] relative h-[80vh]">
              <Image
                className="rounded-lg"
                src={`${HOST}/${imageUrl}`}
                fill
                // width={"1000"}
                alt="fileUrl"
              />
            </div>
            <div className="flex gap-5 fixed top-5 mt-5">
              <Button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(imageUrl as string)}
              >
                <IoMdArrowRoundDown />
              </Button>
              <Button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => {
                  setShowImage(false);
                  setImageUrl(null);
                }}
              >
                <IoCloseSharp />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
