"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { bgColors, HOST } from "@/lib/constants/constsnt";
import { cn } from "@/lib/utils";
import { useAuthslice } from "@/store/slices/auth-slice";
import { useChatSlice } from "@/store/slices/chat-slice";
import { ContactsTypes } from "@/types/contacts-types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import TypingIndicator from "./typing-indicator";

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
    typingUsers,
  } = useChatSlice();
  // console.log("typingUsers", typingUsers);

  const handleClick = (contact: ContactsTypes) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id)
      setSelectedChatMessages([]);
  };

  return (
    <div className="space-y-1">
      <AnimatePresence>
        {contacts?.map((contact: ContactsTypes, index) => {
          const filteredTypingUsers = Object.values(typingUsers).filter(
            (user) => user.senderId === contact._id
          );

          console.log("filteredTypingUsers", filteredTypingUsers);

          return (
            <motion.div
              key={contact._id}
              layout // ✅ Enables smooth transition when order changes
              initial={{ opacity: 0, y: -10 }} // ✅ Initial state
              animate={{ opacity: 1, y: 0 }} // ✅ Animation state
              exit={{ opacity: 0, y: -10 }} // ✅ Exit animation
              transition={{ duration: 0.1, ease: "easeInOut" }} // ✅ Smooth transition
              className={cn(
                "flex w-full cursor-pointer hover:bg-muted rounded-2xl p-2 items-center justify-between",
                selectedChatData && selectedChatData?._id === contact._id
                  ? "bg-bgActive hover:bg-bgHover"
                  : "hover:bg-muted"
              )}
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
                        className="uppercase text-white h-12 w-12 text-lg border flex items-center justify-center rounded-full"
                        style={{
                          backgroundColor: bgColors[contact?.bgColor as number],
                          transition: "all .3s",
                        }}
                      >
                        {contact?.firstName && contact.lastName
                          ? `${contact?.firstName[0]}${contact.lastName[0]}`
                          : contact?.email?.[0]}
                      </div>
                    )}
                  </div>
                )}
                {isChannel && (
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50">
                    #
                  </div>
                )}
                <div>
                  {isChannel ? (
                    <p className="font-semibold text-sm">{contact.name}</p>
                  ) : (
                    <p className="font-semibold text-sm">
                      {contact.firstName} {contact.lastName}
                    </p>
                  )}
                  {/* {Object.values(typingUsers).map((user, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <span className="text-xs text-green-700 font-semibold">
                        {user.firstName} {user.lastName} is typing...
                      </span>
                    </span>
                  ))} */}
                  {filteredTypingUsers.length > 0 && (
                    <TypingIndicator typingUsersList={filteredTypingUsers} />
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">12:34pm</div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ContactList;
