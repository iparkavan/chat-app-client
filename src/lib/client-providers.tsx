"use client";

import React, { useEffect, useState } from "react";
import { axios } from "./axios";
import { useAuthslice } from "@/store/slices/auth-slice";
// import LottieLoading from "@/common/lottie-loading";

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUserInfo, userInfo } = useAuthslice();

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
        setIsLoading(false);
      }
    };

    if (!userInfo) {
      getUserInfo();
    } else {
      setIsLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default ClientProviders;

// import React from "react";
// import Lottie from "react-lottie";
// import animationData from "../lib/animationData.json";

// const RootLoading = () => {
//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };

//   return (
//     <div>
//       <Lottie options={defaultOptions} height={400} width={400} />
//     </div>
//   );
// };

// export default RootLoading;
