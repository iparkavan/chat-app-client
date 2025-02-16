export type senderReciver = {
  _id: string;
  email: string;
  bgColor: number;
  firstName: string;
  lastName: string;
};

export type MessagesTypes = {
  _id: string;
  sender: string;
  recipient: string;
  messageType: string;
  content: string;
  fileUrl: string;
  timestamp: string;
};
