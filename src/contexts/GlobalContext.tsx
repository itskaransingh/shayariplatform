"use client";

import { getUserAccount } from "@/lib/appwrite";
import { Models } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext<IState>({} as IState);

interface IState {
  account: Models.User<Models.Preferences> | null;
  isAccountDataFetching: boolean;
}

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

const GlobalProvider = ({ children }: any) => {
  const [account, setAccount] = useState<any>(null);
  const [isAccountDataFetching, setIsAccountDataFetching] = useState(false);

  useEffect(() => {
    setIsAccountDataFetching(true);
    getUserAccount()
      .then((acct) => {
        console.log(acct);
        setAccount(acct);
      })
      .catch((err) => {
        console.log(err);
        setAccount(null);
      })
      .finally(() => {
        setIsAccountDataFetching(false);
      });
  }, []);

  const state: IState = {
    account,
    isAccountDataFetching,
  };

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext, useGlobalContext };
export default GlobalProvider;
