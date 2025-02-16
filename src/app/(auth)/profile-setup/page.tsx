"use client";

// import RootLoading from "@/app/loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ProfileSetupFields,
  profileSetupSchema,
} from "@/features/authentication/schemas/profile-setup-schema";
import { ImageChangeResponse } from "@/features/authentication/types/authentication-type";
import { axios } from "@/lib/axios";
import { bgColors, HOST, randomIndex } from "@/lib/constants/constsnt";
import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { useAuthslice } from "@/store/slices/auth-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const ProfileSetup = () => {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [bgColor, setBgColor] = useState<number>(randomIndex);

  const { userInfo, setUserInfo } = useAuthslice();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProfileSetupFields>({
    resolver: zodResolver(profileSetupSchema),
  });

  useEffect(() => {
    if (userInfo?.profileSetup) {
      toast("Please setup your profile to continue.");
      router.push(routes.chatPage);
    }
  }, [userInfo?.profileSetup, router]);

  useEffect(() => {
    if (userInfo?.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setBgColor(userInfo.bgColor as number);
    }
    if (userInfo?.profileImage) {
      setImage(`${HOST}/${userInfo.profileImage}`);
    }
  }, [
    userInfo?.profileSetup,
    userInfo?.profileImage,
    userInfo?.bgColor,
    userInfo?.firstName,
    userInfo?.lastName,
  ]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`/api/auth/get-userinfo`, {
          withCredentials: true,
        });
        if (response?.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setIsUserInfoLoading(false);
      }
    };

    if (!userInfo) {
      getUserInfo();
    } else {
      setIsUserInfoLoading(false);
    }
  }, [userInfo, setUserInfo]);

  // if (isUserInfoLoading) {
  //   return <RootLoading />;
  // }

  const onProfileSetupSubmit: SubmitHandler<ProfileSetupFields> = async ({
    firstName,
    lastName,
  }) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/auth/update-profile`,
        {
          firstName,
          lastName,
          bgColor,
        },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data });
        toast.success("Profile updated successfully");
        router.push(routes.chatPage);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast(error.message);
      setIsLoading(false);
    }
  };

  const handleFileInputClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);

      const response = await axios.post<ImageChangeResponse>(
        `/api/auth/add-profile-image`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.profileImage) {
        if (userInfo) {
          setUserInfo({
            ...userInfo,
            profileImage: response.data.profileImage,
          });
          toast.success("Image Uploaded Successfully");
        }
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete("/api/auth/remove-profile-image", {
        withCredentials: true,
      });

      if (response.status === 200) {
        if (userInfo) {
          setUserInfo({ ...userInfo, profileImage: null });
        }
        toast.success("Image removed successfully");
        setImage(undefined);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6">
      <form
        className="mx-auto grid w-[350px] gap-6"
        onSubmit={handleSubmit(onProfileSetupSubmit)}
      >
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Profile Setup</h1>
          <p className="text-balance text-muted-foreground">
            Complete your profile setup to proceed further
          </p>
        </div>

        <div className="flex items-center justify-center flex-col gap-5">
          <div
            className="relative h-32 md:h-48 w-32 md:w-48 flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={cn(
                    `uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center rounded-full text-white`
                  )}
                  style={{
                    backgroundColor: bgColors[bgColor],
                    transition: "all .3s",
                  }}
                >
                  {firstName && lastName
                    ? `${firstName.split("").shift()}${lastName
                        .split("")
                        .shift()}`
                    : userInfo?.email?.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".jpg, .png, .jpeg, .svg, .webp"
            />
          </div>
          {!image && (
            <div className="flex items-center gap-3">
              {bgColors.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    `w-10 h-10 rounded-full transition-all duration-300`,
                    bgColor === index ? "ring-4 ring-offset-1 ring-primary" : ""
                  )}
                  onClick={() => setBgColor(index)}
                  style={{ backgroundColor: item }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  onChange(event) {
                    setFirstName(event.target.value);
                  },
                })}
                value={userInfo?.firstName || undefined}
                placeholder="Max"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="lastName"
                placeholder="Robinson"
                value={userInfo?.lastName || undefined}
                {...register("lastName", {
                  onChange(event) {
                    setLastName(event.target.value);
                  },
                })}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              disabled
              value={userInfo?.email || undefined}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Proceed
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;
