import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "react-toast-notifications";
import { AccountsContext } from "../context/AccountContext";
import { useState } from "react";
import { AccountsData } from "../interfaces";
import { DocumentData } from "firebase/firestore";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const [accountData, setAccountData] = useState<AccountsData | DocumentData>();
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AccountsContext.Provider value={{ accountData, setAccountData }}>
            <Component {...pageProps} />
          </AccountsContext.Provider>
        </ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
