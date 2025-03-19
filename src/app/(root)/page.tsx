"use client";

import ChatUsersContainer from "@/features/chat-room/left-container/chat-users-container";
import ChatContainer from "@/features/chat-room/right-container/chat-container";
import { useAuthslice } from "@/store/slices/auth-slice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/constants/routes";
import { toast } from "sonner";
import WelcomeContainer from "@/features/chat-room/right-container/welcome-container";
import Sidebar from "@/features/sidebar/sidebar";
import { useChatSlice } from "@/store/slices/chat-slice";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const isChatting = false;

  const { userInfo } = useAuthslice();
  const {
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useChatSlice();

  const { selectedChatData } = useChatSlice();

  // useEffect(() => {
  //   if (!userInfo?.profileSetup) {
  //     toast("Please setup your profile to continue.");
  //     router.push(routes.profileSetup);
  //   }
  // }, [userInfo?.profileSetup, router]);

  return (
    // <main className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_400px_1fr] h-screen">
    //   {/* Uploading Overlay */}
    //   {isUploading && (
    //     <div className="fixed inset-0 z-20 bg-black/80 flex flex-col gap-5 items-center justify-center backdrop-blur-lg">
    //       <h5 className="text-white text-5xl">Uploading File</h5>
    //       <p className="text-3xl text-white">{fileUploadProgress}%</p>
    //     </div>
    //   )}

    //   {/* Downloading Overlay */}
    //   {isDownloading && (
    //     <div className="fixed inset-0 z-20 bg-black/80 flex flex-col gap-5 items-center justify-center backdrop-blur-lg">
    //       <h5 className="text-white text-5xl">Downloading File</h5>
    //       <p className="text-3xl text-white">{fileDownloadProgress}%</p>
    //     </div>
    //   )}

    //   {/* Sidebar (Hidden on Small Screens) */}
    //   <div className="hidden md:block border-r">
    //     <Sidebar />
    //   </div>

    //   {/* Chat Users List (Hidden when chat is selected on small screens) */}
    //   <div
    //     className={`border-r ${selectedChatData ? "hidden sm:block" : "block"}`}
    //   >
    //     <ChatUsersContainer />
    //   </div>

    //   {/* Chat Section (Shows Chat or Welcome Message) */}
    //   <div className={`${selectedChatData ? "block" : "hidden"} w-full`}>
    //     {selectedChatData ? <ChatContainer /> : <WelcomeContainer />}
    //   </div>
    // </main>

    <main className="flex">
      {isUploading && (
        <div className="h-screen w-screen fixed top-0 z-20 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-white text-5xl">Uploading File</h5>
          <p className="text-3xl text-white">{fileUploadProgress}%</p>
        </div>
      )}
      {isDownloading && (
        <div className="h-screen w-screen fixed top-0 z-20 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-white text-5xl">Downloading File</h5>
          <p className="text-3xl text-white">{fileDownloadProgress}%</p>
        </div>
      )}
      <div className="border-r hidden md:block">
        <Sidebar />
      </div>
      <div
        className={cn(
          `border-r w-full md:w-[600px] `,
          selectedChatData === undefined ? "block" : "hidden md:block"
        )}
      >
        <ChatUsersContainer />
      </div>
      <div
        className={cn(
          "w-full",
          selectedChatData === undefined ? "hidden" : "block"
        )}
      >
        {selectedChatData === undefined ? (
          <div className="">
            <WelcomeContainer />
          </div>
        ) : (
          <div className="">
            <ChatContainer />
          </div>
        )}
      </div>
    </main>
  );
}

{
  /* <ResizableMainContent children={undefined} /> */
}
{
  /* <div className="grid grid-cols-4 border rounded-2xl">
        <div className="border-r">
          <ChatUsersContainer />
        </div>
        <div className="w-full col-span-3">
          {isChatting ? (
            <div className="flex items-center justify-center h-full">
              <WelcomeContainer />
            </div>
          ) : (
            <div className="">
              <ChatContainer />
            </div>
          )}
        </div>
      </div> */
}
