import React, { useEffect } from "react";
import ChatUserHeader from "./chat-users-header";
import ChatUserCard from "./components/contacts-list";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { GET_DM_CONTACTS_ROUTES } from "@/lib/api-routes";
import { useChatSlice } from "@/store/slices/chat-slice";
import ContactList from "./components/contacts-list";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import CreateChannel from "./components/create-channel";

const ChatUsersContainer = () => {
  const { directMessagesContacts, setDirectMessagesContacts } = useChatSlice();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await axios.get(GET_DM_CONTACTS_ROUTES, {
          withCredentials: true,
        });

        if (response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error: any) {
        console.log(error);
        toast(error.message);
      }
    };

    getContacts();
  }, []);

  return (
    <div className="relative">
      <ChatUserHeader />
      {/* Current Chat Users will be displayed here */}
      <section className="p-2 overflow-auto h-[calc(95vh-5vh)]">
        <Heading heading="Direct Message" />

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidded">
          <ContactList contacts={directMessagesContacts} isChannel={false} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <Heading heading="Channels" />
          <CreateChannel />
        </div>
      </section>
    </div>
  );
};

export default ChatUsersContainer;

const Heading = ({ heading }: { heading: string }) => {
  return (
    <h6 className="uppercase tracking-widest text-muted-foreground p-2 font-light text-sm">
      {heading}
    </h6>
  );
};
