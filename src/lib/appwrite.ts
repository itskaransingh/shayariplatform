import { Client as Appwrite, Databases, Account, Models, ID } from "appwrite";
import { TPostFormSchema, TPostSchema } from "./validations/post";

interface ISdk {
  db: Databases ;
  account: Account;
}

type TCreateUser = {
  id: string;
  name: string;
  email: string;
  password: string;
}

let appwriteApi = {
  clientSdk: null as null | ISdk,
  clientSideProvider: () => {
    if (appwriteApi.clientSdk) {
      return appwriteApi.clientSdk;
    }
    console.log("attaching to DB now!");
    let appwriteClient = new Appwrite();

    appwriteClient
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

    appwriteApi.clientSdk = {
      db: new Databases(appwriteClient),
      account: new Account(appwriteClient),
    };
    return appwriteApi.clientSdk;
  },
  logout: () => {
    return appwriteApi.clientSideProvider().account.deleteSession("current");
  },
  createOauthGoogle: (
    successUrl: string = "http://localhost:3000/",
    failureUrl?: string 
  ) => {
    return appwriteApi
      .clientSideProvider()
      .account.createOAuth2Session("google", successUrl, failureUrl);
  },
  createUser: ({
    id,
    name,
    email,
    password,
  }:TCreateUser) => {
    return appwriteApi
      .clientSideProvider()
      .account.create(id, email, password, name);
  },
  signInWithEmailAndPassword: (email: string, password: string) => {
    return appwriteApi
      .clientSideProvider()
      .account.createEmailSession(email, password);
  },
  sendVerificationEmail: (url: string = "http://localhost:3000/register/verify?from=/feed/3213e2e23dece") => {
    return appwriteApi.clientSideProvider().account.createVerification(url);
  },
  verifyEmail: (userId: string, secret:string) => {
    return appwriteApi.clientSideProvider().account.updateVerification(userId, secret);
  },
  getLoggedInUserSession: () => {
    return appwriteApi.clientSideProvider().account.getSession("current");
  },
  getLoggedInUser: () => {
    return appwriteApi.clientSideProvider().account.get();
  },
  isUserLoggedIn: async () => {
    try{
      await appwriteApi.clientSideProvider().account.getSession("current");
      return true
    } catch {
      return false
    }
  }, 
  createPost: async (post:TPostSchema) => {
    return await appwriteApi.clientSideProvider().db.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,  ID.unique(), post);
  }
};

//called from Next.js/React in a top-level component,  I  use useSWR() to call this and return the account object.
// the account object will be empty if no previous google OAuth2 session had been established.
async function getUserAccount() {
  let account: Models.User<Models.Preferences> | null =
    {} as Models.User<Models.Preferences>;
  try {
    account = await appwriteApi.getLoggedInUser();
  } catch (error) {
    console.log("Error getting current user account!", error);
    return null
  }
  console.log("Account -=-", account);
  return account;
}

export { getUserAccount };

export default appwriteApi;
