"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignupFields,
  signupSchema,
} from "@/features/authentication/schemas/signup-schema";
import { SignupResponse } from "@/features/authentication/types/authentication-type";
import { axios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuthslice } from "@/store/slices/auth-slice";

const page = () => {
  const router = useRouter();
  const { setUserInfo } = useAuthslice();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupFields>({ resolver: zodResolver(signupSchema) });

  const onSubmit: SubmitHandler<SignupFields> = async ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    const response = await axios.post<SignupResponse>(
      "/api/auth/signup",
      { firstName, lastName, email, password },
      { withCredentials: true }
    );

    if (response.status === 201) {
      setUserInfo({
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        profileImage: response.data.profileImage,
        profileSetup: response.data.profileSetup,
        bgColor: response.data.bgColor,
      });

      router.push("/profile-setup");
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
        <div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
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
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;
