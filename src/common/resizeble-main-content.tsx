import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "../features/sidebar/sidebar";
import React, { Children } from "react";
import ChatUsersContainer from "@/features/chat-room/left-container/chat-users-container";
import ChatContainer from "@/features/chat-room/right-container/chat-container";

export function ResizableMainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-2xl border">
      <ResizablePanel defaultSize={25} maxSize={35} minSize={20}>
        <div className="">
          <ChatUsersContainer />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="">
          <ChatContainer />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
