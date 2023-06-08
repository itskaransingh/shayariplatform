import { toast } from "@/hooks/use-toast";
import { AppwriteException } from "appwrite";

export enum AuthErrors {
  USER_EXISTS = "user_already_exists",
  INVALID_TOKENS = "user_invalid_token",
  INVALID_LOGIN_CREDENTIALS = "user_invalid_credentials",
}

export enum PostErrors {
  POST_NOT_FOUND = "document_not_found",
}

export enum GeneralAppwriteExceptions {
  USER_NOT_FOUND = "user_not_found",
  UNAUTHORIZED_ERROR = "general_unauthorized_scope",
  // USER_NOT_ACTIVE = "user_not_active",
  // USER_NOT_LOGGED_IN = "user_not_logged_in",
  // USER_NOT_VERIFIED = "user_not_verified",
  // USER_NOT_EMAIL_VERIFIED = "user_not_email_verified",
  RATE_LIMIT_REACHED = "general_rate_limit_exceeded",
}

// general_argument_invalid

export interface IConfigData {
  title: string;
  description?: string;
  duration?: number;
}

const errorToastConfig: Record<
  AuthErrors | GeneralAppwriteExceptions | PostErrors,
  IConfigData
> = {
  [AuthErrors.USER_EXISTS]: {
    title: "User Already Exists",
    description: "An account with this email address already exists.",
  },
  [AuthErrors.INVALID_TOKENS]: {
    title: "Invalid Tokens",
    description:
      "Your credentials are invalid or they have expired, try sending the verification email again.",
    duration: 9000,
  },
  [AuthErrors.INVALID_LOGIN_CREDENTIALS]: {
    
    title: "Email or Password Incorrect",
    description: "Please check the email and password.",

  },
  [PostErrors.POST_NOT_FOUND]: {
    title: "Post Not Found",
    description: "This post does not exist.",
    duration: 9000,
  },
  [GeneralAppwriteExceptions.USER_NOT_FOUND]: {
    title: "User Or Session Not Found",
  },
  [GeneralAppwriteExceptions.RATE_LIMIT_REACHED]: {
    title: "Rate Limit Exceeded",
    description: "Too many requests. Please try again later.",
    duration: 9000,
  },
  [GeneralAppwriteExceptions.UNAUTHORIZED_ERROR]: {
    title: "Unauthorized",
    description: "You are not authorized to perform this action.",
  },
};

export const toastErrorHandler = (error: any, customDuration?: number) => {
  console.log({ error });
  if (error instanceof AppwriteException) {

    const knownAppwriteExceptions =
      errorToastConfig[error.type as keyof typeof errorToastConfig];

    if (knownAppwriteExceptions) {
      const { title, description, duration } = knownAppwriteExceptions;

      toast({
        title,
        description,
        variant: "destructive",
        duration: customDuration || duration,
      });
      return;
    }

    toast({
      title: "Something went wrong",
      description: error.message,
      variant: "destructive",
      duration: customDuration ,
    })

  }

  toast({
    title: "Something went wrong",
    description: error.message,
    variant: "destructive",
    duration: customDuration,
  });
};
