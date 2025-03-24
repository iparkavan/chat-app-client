import React from "react";

type TypingUser = {
  firstName: string;
  lastName: string;
  recipientId: string;
  profileImage?: string | null;
};

type TypingIndicatorProps = {
  typingUsersList: TypingUser[];
};

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsersList,
}) => {
  return (
    <>
      {typingUsersList.map((user, index) => (
        <span key={index} className="flex items-center gap-1">
          <span className="text-xs text-green-700 font-semibold">
            Typing...
          </span>
        </span>
      ))}
    </>
  );
};

export default TypingIndicator;
