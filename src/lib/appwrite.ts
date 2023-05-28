import { Client as Appwrite, Databases, Account, Models, ID } from "appwrite";

interface ISdk {
  dbobj: Databases | null;
  accountobj: Account;
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
      dbobj: null,
      accountobj: new Account(appwriteClient),
    };
    return appwriteApi.clientSdk;
  },
  deleteCurrentSession: () => {
    return appwriteApi.clientSideProvider().accountobj.deleteSession("current");
  },
  createOauthGoogle: (
    successUrl: string = "http://localhost:3000/",
    failureUrl?: string 
  ) => {
    return appwriteApi
      .clientSideProvider()
      .accountobj.createOAuth2Session("google", successUrl, failureUrl);
  },
  createUser: ({
    id,
    name,
    email,
    password,
  }: {
    id: string;
    name: string;
    email: string;
    password: string;
  }) => {
    return appwriteApi
      .clientSideProvider()
      .accountobj.create(id, email, password, name);
  },
  createEmailSession: (email: string, password: string) => {
    return appwriteApi
      .clientSideProvider()
      .accountobj.createEmailSession(email, password);
  },
  sendVerificationEmail: (url: string = "http://localhost:3000/register/verify?from=feed/3213e2e23dece") => {
    return appwriteApi.clientSideProvider().accountobj.createVerification(url);
  },
  verifyEmail: (userId: string, secret:string) => {
    return appwriteApi.clientSideProvider().accountobj.updateVerification(userId, secret);
  },
  getCurrentSession: () => {
    return appwriteApi.clientSideProvider().accountobj.getSession("current");
  },
  getUserAccount: () => {
    return appwriteApi.clientSideProvider().accountobj.get();
  },
};

//called from Next.js/React in a top-level component,  I  use useSWR() to call this and return the account object.
// the account object will be empty if no previous google OAuth2 session had been established.
async function getUserAccount() {
  let account: Models.User<Models.Preferences> | null =
    {} as Models.User<Models.Preferences>;
  try {
    account = await appwriteApi.getUserAccount();
  } catch (error) {
    console.log("Error getting current user account!", error);
    return null
  }
  console.log("Account -=-", account);
  return account;
}

export { getUserAccount };

export default appwriteApi;
