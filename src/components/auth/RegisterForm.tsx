"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input, Label } from "../ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/Button";
import { Icons } from "../ui/Icons";
import { useState } from "react";
import appwriteApi from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppwriteException, ID } from "appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import { toastErrorHandler } from "@/lib/errorHandling";
import { RegisterSchema } from "@/lib/validations/auth";
import { toast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const from = useSearchParams().get("from");

  type TFormData = z.infer<typeof RegisterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: TFormData) => {
    setIsLoading(true);
    let createdUser;

    AppwriteException;
    try {
      createdUser = await appwriteApi.createUser({
        id: ID.unique(),
        ...data,
      });
      console.debug("User Created Successfully", createdUser);

      const newUserSession = await appwriteApi.createEmailSession(
        data.email,
        data.password
      );
      console.debug("New User Session Created Successfully", newUserSession);

      const verificationToken = await appwriteApi.sendVerificationEmail(`http://localhost:3000/register/verify${from?'?from='+from:""}`);
      console.debug(
        "Verification Token Created Successfully",
        verificationToken
      );
    
      toast({
        title: "Account Created Successfully",
        description: "Please check your email for verification",
        duration: 9000,
      })

      router.push("/register/verify");
    

    } catch (error: any) {
      toastErrorHandler(error);
      console.log({ error, message: error.message });
    } finally {
      setIsLoading(false);
    }
    console.log(createdUser);
    console.log("email sent");
  };

  return (
    <div className="grid gap-6 w-full">
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className=" grid gap-2 "
      >
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            autoComplete="name"
            autoCorrect="off"
            {...register("name")}
            type="text"
            disabled={isGoogleLoading || isLoading}
            placeholder="Karan Singh"
          />
          {errors?.name && (
            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isGoogleLoading || isLoading}
            {...register("email")}
          />
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            placeholder="password"
            type="password"
            autoComplete="new-password"
            autoCorrect="off"
            disabled={isGoogleLoading || isLoading}
            {...register("password")}
          />
          {errors?.password && (
            <p className="px-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isGoogleLoading || isLoading}
          className={cn(buttonVariants(), "w-full")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => {
            console.log("google");
            setIsGoogleLoading(true);
            appwriteApi.createOauthGoogle();
          }}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Google
        </button>
      </div>
    </div>
  );
}
