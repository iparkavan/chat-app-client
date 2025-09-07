import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axios } from "@/lib/axios";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
  SEARCHCONTACTSROUTES,
} from "@/lib/api-routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthslice } from "@/store/slices/auth-slice";
import { bgColors, HOST } from "@/lib/constants/constsnt";
import { ContactsTypes } from "@/types/contacts-types";
import { useChatSlice } from "@/store/slices/chat-slice";
import { Command } from "@/components/ui/command";
import { CommandEmpty } from "cmdk";
import MultipleSelector from "@/components/ui/multiple-selector";

type selectedContactsTypes = {
  label: string;
  value: string;
};

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannels } =
    useChatSlice();

  const [newChannelModal, setNewChannelModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState<ContactsTypes[]>([]);

  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState<
    selectedContactsTypes[]
  >([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(GET_ALL_CONTACTS_ROUTES, {
        // withCredentials: true,
      });
      if (response.status === 200) {
        setAllContacts(response.data.contacts);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await axios.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((item) => item.value),
          }
          // { withCredentials: true }
        );

        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannels(response.data.channel);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={"ghost"}
                size={"icon"}
                // onClick={() => setIsNewContactModal(true)}
              >
                <FaPlus className="" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create New Channel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-[600px]">
        <DialogHeader>
          <DialogTitle>Channel Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Input
            placeholder="Channel Name"
            onChange={(e) => setChannelName(e.target.value)}
            value={channelName}
          />
        </div>
        <div>
          <MultipleSelector
            defaultOptions={allContacts}
            placeholder="Search Contacts"
            value={selectedContacts}
            onChange={setSelectedContacts}
            emptyIndicator={<p>No Results Found</p>}
          />
        </div>
        <div>
          <Button onClick={createChannel}>Create Channel</Button>
        </div>
        <ScrollArea className="h-[350px]">
          <div className="flex flex-col"></div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
