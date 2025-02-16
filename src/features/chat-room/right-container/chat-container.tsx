import React from "react";
import ChatHeader from "./chat-header";
import ChatForm from "./chat-form";
import ChatArea from "./chat-area";

const ChatContainer = () => {
  return (
    <section>
      <div className="px-8 border-b">
        <ChatHeader />
      </div>

      <div className="">
        <ChatArea />
      </div>

      <div className="px-2 border-t">
        <ChatForm />
      </div>
    </section>
  );
};

export default ChatContainer;

// absolute bottom-0
