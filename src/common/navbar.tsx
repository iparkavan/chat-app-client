"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { ThemeModeToggle } from "@/common/theme-mode-menu";

const Navbar = () => {

  const logoutHanlder = () => {
  };

  return (
    <div className="flex items-center justify-end h-full">
      <div className="flex items-center justify-center gap-4">
        <div>
          <ThemeModeToggle />
        </div>
        <Button variant={"destructive"} size={"icon"} onClick={logoutHanlder}>
          <ChevronRightIcon className="" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
