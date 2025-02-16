import React, { useState } from "react";
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
import { SEARCHCONTACTSROUTES } from "@/lib/api-routes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthslice } from "@/store/slices/auth-slice";
import { bgColors, HOST } from "@/lib/constants/constsnt";
import { ContactsTypes } from "@/types/contacts-types";
import { useChatSlice } from "@/store/slices/chat-slice";

const ChatUserHeader = () => {
  const { setSelectedChatType, setSelectedChatData } = useChatSlice();

  const [isNewContactModal, setIsNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState<ContactsTypes[]>([]);

  const searchContacts = async (searchTerms: string) => {
    try {
      if (searchTerms.length >= 0) {
        const response = await axios.post(
          SEARCHCONTACTSROUTES,
          { searchTerms },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        } else {
          setSearchedContacts([]);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const selectNewContact = (contact: ContactsTypes) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
    setIsNewContactModal(false);
  };

  return (
    <div className="p-3 rounded-t-2xl flex items-center justify-between">
      <h1 className="text-3xl font-bold">Chats</h1>

      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setIsNewContactModal(true)}
            >
              <FaPlus className="" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}

      <Dialog open={isNewContactModal} onOpenChange={setIsNewContactModal}>
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
                <p>Select New Contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="flex flex-col h-[600px]">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contacts"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[350px]">
            <div className="flex flex-col">
              {searchedContacts.length > 0 &&
                searchedContacts?.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex items-center cursor-pointer hover:bg-primary-foreground p-3 rounded-xl justify-start gap-4"
                    onClick={() => selectNewContact(contact)}
                  >
                    <Avatar className="flex items-center gap-3 cursor-pointer">
                      {contact?.profileImage ? (
                        <div className="h-12 w-12">
                          <AvatarImage
                            src={`${HOST}/${contact?.profileImage}` || ""}
                            alt="profile"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div
                          className={`uppercase text-white h-12 w-12 text-lg border flex items-center justify-center rounded-full`}
                          style={{
                            backgroundColor: bgColors[contact.bgColor],
                            transition: "all .3s",
                          }}
                        >
                          {contact?.firstName && contact.lastName
                            ? `${contact?.firstName
                                .split("")
                                .shift()}${contact.lastName.split("").shift()}`
                            : contact?.email?.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span>
                        {contact?.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
            </div>
            {searchedContacts.length <= 0 && <div>Search a contacts</div>}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatUserHeader;
