"use client";

import { useForm } from "react-hook-form";
import { Input, Label } from "../ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/Button";
import { Icons } from "../ui/Icons";
import { useState } from "react";
import appwriteApi from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { Models } from "appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import { toastErrorHandler } from "@/lib/errorHandling";
import { LoginFormSchema, TLoginFormSchema } from "@/lib/validations/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const from = useSearchParams().get("from");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormSchema>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onLoginThroughEmail = async (data: TLoginFormSchema) => {
    setIsLoading(true);

    let createdUserSession: Models.Session | null = null;

    try {
      createdUserSession = await appwriteApi.signInWithEmailAndPassword(
        data.email,
        data.password
      );
      console.log(createdUserSession);
      console.log("session created");
      if (createdUserSession.$id) {
        router.push(from ? from : "/");
      }
    } catch (error: any) {
      toastErrorHandler(error);
      console.log({ error, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 w-full">
      <form
        action=""
        onSubmit={handleSubmit(onLoginThroughEmail)}
        className=" grid gap-2 "
      >
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
            autoComplete="current-password"
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
            "Sign In"
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
            console.log("google", window.location.href);
            setIsGoogleLoading(true);
            try {
              appwriteApi.createOauthGoogle(
                "http://localhost:3000" + (from ? from : "/")
              );
            } catch (error: any) {
              toastErrorHandler(error);
              console.log({ error, message: error.message });
            } finally {
              setIsGoogleLoading(false);
            }
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
