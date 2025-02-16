"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { bgColors, HOST } from "@/lib/constants/constsnt";
import { cn } from "@/lib/utils";
import { useAuthslice } from "@/store/slices/auth-slice";
import { useChatSlice } from "@/store/slices/chat-slice";
import { ContactsTypes } from "@/types/contacts-types";
import Image from "next/image";
import React from "react";

interface ContactListProps {
  contacts: ContactsTypes[];
  isChannel: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  isChannel = false,
}) => {
  const { userInfo } = useAuthslice();
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useChatSlice();

  const handleClick = (contact: ContactsTypes) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id)
      setSelectedChatMessages([]);
  };

  return (
    <div className="space-y-1">
      {contacts?.map((contact: ContactsTypes, index) => (
        <div
          className={cn(
            "flex w-full cursor-pointer hover:bg-muted rounded-2xl p-2 items-center justify-between",
            selectedChatData && selectedChatData?._id === contact._id
              ? "bg-bgActive hover:bg-bgHover"
              : "hover:bg-muted"
          )}
          key={contact._id}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center justify-start gap-4">
            {!isChannel && (
              <div>
                {contact.profileImage ? (
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`${HOST}/${contact?.profileImage}` || ""}
                      alt="profile"
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                ) : (
                  <div
                    className={`uppercase text-white h-12 w-12 text-lg border flex items-center justify-center rounded-full`}
                    style={{
                      backgroundColor: bgColors[contact?.bgColor as number],
                      transition: "all .3s",
                    }}
                  >
                    {userInfo?.firstName && userInfo.lastName
                      ? `${userInfo?.firstName
                          .split("")
                          .shift()}${userInfo.lastName.split("").shift()}`
                      : userInfo?.email?.split("").shift()}
                  </div>
                )}
              </div>
            )}
            {isChannel && <div>#</div>}
            <div>
              {isChannel ? (
                <p className="font-semibold text-sm">{contact.name}</p>
              ) : (
                <p className="font-semibold text-sm">
                  {contact.firstName} {contact.lastName}
                </p>
              )}

              <span className="text-xs text-green-700 font-semibold">
                Typing...
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">12:34pm</div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
