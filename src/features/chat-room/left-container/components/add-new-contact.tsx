import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatSlice } from "@/store/slices/chat-slice";
import { SEARCHCONTACTSROUTES } from "@/lib/api-routes";
import { axios } from "@/lib/axios";
import { ContactsTypes } from "@/types/contacts-types";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { bgColors, HOST } from "@/lib/constants/constsnt";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface AddNewContactProps {
  isNewContactModal: boolean;
  setIsNewContactModal: (value: boolean) => void;
}

const AddNewContact = ({
  isNewContactModal,
  setIsNewContactModal,
}: AddNewContactProps) => {
  const { setSelectedChatType, setSelectedChatData } = useChatSlice();

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
    <Dialog open={isNewContactModal} onOpenChange={setIsNewContactModal}>
      {/* <DialogTrigger>
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
        </DialogTrigger> */}
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
  );
};

export default AddNewContact;
