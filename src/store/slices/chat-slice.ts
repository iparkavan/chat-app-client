import { UserInfoTypes } from "@/types/authentication-types";
import { ContactsTypes } from "@/types/contacts-types";
import { MessagesTypes } from "@/types/messages";
import { create } from "zustand";

type ChatTypes = "channel" | "contact";

type ChatSliceTypes = {
  selectedChatType: ChatTypes | undefined;
  selectedChatData: ContactsTypes | undefined;
  selectedChatMessages: MessagesTypes[];
  directMessagesContacts: ContactsTypes[];
  isUploading: boolean;
  isDownloading: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;

  setIsUploading: (isUploading: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setFileUploadProgress: (fileUploadProgress: number) => void;
  setFileDownloadProgress: (fileDownloadProgress: number) => void;
  setSelectedChatType: (selectedChatType: ChatTypes) => void;
  setSelectedChatData: (selectedChatData: ContactsTypes) => void;
  setSelectedChatMessages: (selectedChatMessages: MessagesTypes[]) => void;
  setDirectMessagesContacts: (directMessagesContacts: ContactsTypes[]) => void;
  closeChat: () => void;
  addMessage: (message: any) => void;
};

export const useChatSlice = create<ChatSliceTypes>()((set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,

  setIsUploading: (isUploading: boolean) => set({ isUploading }),
  setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress: number) =>
    set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress: number) =>
    set({ fileDownloadProgress }),
  setSelectedChatType: (selectedChatType: ChatTypes) =>
    set({ selectedChatType }),
  setSelectedChatData: (selectedChatData: ContactsTypes) =>
    set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages: MessagesTypes[]) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts: ContactsTypes[]) =>
    set({ directMessagesContacts }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
}));
