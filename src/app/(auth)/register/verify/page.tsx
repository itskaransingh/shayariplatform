"use client";

import { buttonVariants } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { toast } from "@/hooks/use-toast";
import appwriteApi from "@/lib/appwrite";
import { toastErrorHandler } from "@/lib/errorHandling";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserVerification() {
  const [verificationLinkResended, setVerificationLinkResended] =
    useState(false);
  const [timerOfResendingEmailAgain, setTimerOfResendingEmailAgain] =
    useState(30);
  const [isVerificationInProgress, setIsVerificationInProgress] =
    useState(false);
  const searchparams = useSearchParams();
  const router = useRouter();

  const userId = searchparams.get("userId");
  const secret = searchparams.get("secret");
  const from = searchparams.get("from");
  const credentialsAreNotAvailable = !(userId && secret);

  useEffect(() => {
       appwriteApi.getLoggedInUserSession().then((session) => {
          console.log(session);
       }).catch((error) => {
           toastErrorHandler(error);
           console.log({error});
           router.push("/register");
       })
  },[])

  useEffect(() => {
    if (!verificationLinkResended) {
      return;
    }
    const timer = setInterval(() => {
      if (timerOfResendingEmailAgain === 0) {
        setVerificationLinkResended(false);
      }
      console.debug(timerOfResendingEmailAgain);
      setTimerOfResendingEmailAgain((x) => x - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [verificationLinkResended, timerOfResendingEmailAgain]);

  const ResendEmailHandler = async () => {
    const verification = await appwriteApi.sendVerificationEmail();
    if (verification) {
      toast({
        title: "Verification Email Sent",
        description: "Check your email to verify your account",
        duration: 9000,
      });
      setVerificationLinkResended(true);
    }
  };

  const VerifyEmailHandler = async () => {
    console.log("from :", from);
    setIsVerificationInProgress(true);
    let verification;
    try {
      verification = await appwriteApi.verifyEmail(
        userId as string,
        secret as string
      );

      toast({
        title: "Verification Successful",
      });

      if (from) {
        router.push(from);
      } else {
        router.push("/");
      }

    } catch (error: any) {
      toastErrorHandler(error);
    } finally {
      setIsVerificationInProgress(false);
    }
  };

  return (
    <div className="container h-screen flex  items-center">
      <div className=" flex w-full sm:w-[350px] mx-auto items-center space-y-6 flex-col justify-center ">
        <div className="flex flex-col  space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-sm text-muted-foreground">
            Check Your Email to verify your account, also check your spam
          </p>
        </div>
        <button
          disabled={credentialsAreNotAvailable || isVerificationInProgress}
          onClick={async () => await VerifyEmailHandler()}
          className={cn(buttonVariants(), "w-full disabled:cursor-not-allowed")}
        >
          {isVerificationInProgress ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              <span> Verifying </span>
            </>
          ) : (
            <>
              <span>Verify</span>
            </>
          )}
        </button>
        {credentialsAreNotAvailable && (
          <button
            className="hover:text-brand underline underline-offset-4"
            disabled={verificationLinkResended}
            onClick={async () => await ResendEmailHandler()}
          >
            {!verificationLinkResended
              ? "Resend Verification Email"
              : `Wait for ${timerOfResendingEmailAgain} seconds`}
          </button>
        )}
      </div>
    </div>
  );
}
