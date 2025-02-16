"use client";

import React from "react";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

import animationData from "../../public/animationData.json";

const LottieLoading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Lottie options={defaultOptions} height={400} width={400} />
      <p>Loading...</p>
    </div>
  );
};

export default LottieLoading;
