// 'use client'

import { RegisterForm } from "@/components/auth";
import { buttonVariants } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import Link from "next/link";


// import appwriteApi from "@/lib/appwrite";

export default function Register() {
  return (
    <div>
      <div className="grid  lg:grid-cols-2 h-screen w-screen">
        <div className=" bg-muted hidden lg:block"></div>
        <div className="relative  ">
          <div className="flex px-5 py-3 justify-between absolute top-0 left-0 right-0">
            <Link href="../">
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  "gap-2"
                )}
              >
                <Icons.back className="h-5 w-5" />
                Back
              </div>
            </Link>
            <Link href="/login">
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  }),
                  ""
                )}
              >
                Login
              </div>
            </Link>
          </div>
          <div className=" flex h-screen w-[350px] mx-auto items-center space-y-6 flex-col justify-center ">
            <div className="flex flex-col  space-y-2 text-center">
              <Icons.logo className="mx-auto h-6 w-6" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>

            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
