"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./Button";
import Image from "next/image";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Skeleton from "./Skeleton";
import { UserAccountNav } from "./UserAccountNav";

export default function ProfileBtn({
  className,
  inHeader,
  
}: {
  className?: string;
  inHeader?: boolean;
}) {
  const { account, isAccountDataFetching } = useGlobalContext();
  if (inHeader ) {
    return (
      <UserAccountNav
        user={
          account
            ? { name: account?.name, email: account?.email, image: null }
            : null
        }
         className="max-md:hidden"
      />
    );
  }

  if (!account && !isAccountDataFetching)
    return (
      <Link href={"/login"}>
        <div
          className={cn(
            buttonVariants({
              size: "lg",
              variant: "outline",
            }),
            "justify-center gap-5",
            className
          )}
        >
          Login
        </div>
      </Link>
    );

  if (account) {
    return (
      <Link href={"/profile"}>
        <div
          className={cn(
            buttonVariants({
              size: "lg",
              variant: "outline",
            }),
            "justify-between gap-5",
            className
          )}
        >
          <Image
            src={
              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
            }
            className="rounded-full h-7 w-7"
            height={30}
            width={30}
            alt="avatar"
          />
          <span>{account?.name}</span>
        </div>
      </Link>
    );
  }

  return <Skeleton className={cn(className)} />;
}
