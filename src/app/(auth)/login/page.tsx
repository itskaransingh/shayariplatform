import { LoginForm } from "@/components/auth";
import { buttonVariants } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LogIn() {
  return (
    <div className="container h-screen">
      <div className="flex px-5 py-3 justify-between fixed top-0 left-0 right-0">
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
      
      </div>
      <div className=" flex h-screen sm:w-[350px] mx-auto items-center space-y-6 flex-col justify-center ">
        <div className="flex flex-col  space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight"> Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below to sign in
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
