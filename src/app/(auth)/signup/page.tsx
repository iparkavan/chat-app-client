"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignupFields,
  signupSchema,
} from "@/features/authentication/schemas/signup-schema";
import { SignupResponse } from "@/features/authentication/types/authentication-type";
import { axios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuthslice } from "@/store/slices/auth-slice";
import { ACCESS_TOKEN } from "@/lib/constants/variables";
import { Loader } from "lucide-react";

const page = () => {
  const router = useRouter();
  const { setUserInfo } = useAuthslice();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupFields>({ resolver: zodResolver(signupSchema) });

  const onSubmit: SubmitHandler<SignupFields> = async ({
    // firstName,
    // lastName,
    email,
    password,
  }) => {
    try {
      setIsLoading(true);
      const response = await axios.post<SignupResponse>(
        "/api/auth/signup",
        {
          // firstName, lastName,
          email,
          password,
        }
        // { withCredentials: true }
      );

      console.log("response", response);

      if (response.status === 201) {
        setUserInfo({
          ...response.data,
        });

        Cookies.set(ACCESS_TOKEN, response.data.token, {
          expires: 7, // 7 days
          secure: true, // only send on https
          sameSite: "none", // prevents CSRF in most cases
        });

        router.push("/profile-setup");
        setIsLoading(false);
      }
    } catch (error: Error | any) {
      console.error("Signup error:", error);
      setError(error?.response.data.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <form
        className="mx-auto grid w-[350px] gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-balance text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>
        <span className="text-center text-red-500 font-semibold">
          {error && error}
        </span>
        <div>
          <div className="grid gap-4">
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  {...register("firstName")}
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
                  id="last-name"
                  placeholder="Robinson"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div> */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Signin
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;
