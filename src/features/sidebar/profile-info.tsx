import { ThemeModeToggle } from "@/common/theme-mode-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axios } from "@/lib/axios";
import { bgColors, HOST } from "@/lib/constants/constsnt";
import { routes } from "@/lib/constants/routes";
import { useAuthslice } from "@/store/slices/auth-slice";
import { useRouter } from "next/navigation";
import React from "react";
import { IoPowerSharp } from "react-icons/io5";
import { toast } from "sonner";

const ProfileInfo = () => {
  const router = useRouter();

  const { userInfo, setUserInfo } = useAuthslice();

  const logoutHandler = async () => {
    try {
      const response = await axios.post(
        `/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        router.push(routes.login);
        setUserInfo(undefined);
      }
    } catch (error) {
      toast("There is problem with logging out");
    }
  };
  return (
    <div className="">
      <div>
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        </Avatar>
      </div>
      <div className="absolute bottom-9 space-y-3 text-center">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size={"icon"} onClick={logoutHandler}>
                  <IoPowerSharp className="text-red-600 w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <ThemeModeToggle />
        </div>
        <div>
          {userInfo?.profileImage ? (
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={`${HOST}/${userInfo?.profileImage}` || ""}
                alt="profile"
                className="object-cover w-full h-full"
              />
            </Avatar>
          ) : (
            <div
              className={`uppercase text-white h-12 w-12 text-lg border flex items-center justify-center rounded-full`}
              style={{
                backgroundColor: bgColors[userInfo?.bgColor as number],
                transition: "all .3s",
              }}
            >
              {userInfo?.firstName && userInfo.lastName
                ? `${userInfo?.firstName.split("").shift()}${userInfo.lastName
                    .split("")
                    .shift()}`
                : userInfo?.email?.split("").shift()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
