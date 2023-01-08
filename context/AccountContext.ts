import { DocumentData } from "firebase/firestore";
import React from "react";
import { AccountsData } from "../interfaces";

export type AccountContextType = {
  accountData?: AccountsData | DocumentData;
  setAccountData: (value: AccountsData | DocumentData) => void;
};
export const AccountsContext = React.createContext<AccountContextType | null>(
  null
);
