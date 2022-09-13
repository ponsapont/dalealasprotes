import "../styles/globals.css";
import type { AppProps } from "next/app";
import { provider } from "../services/firebaseConfig";

import { getAuth, getRedirectResult, signInWithRedirect, User } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Center, ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { IntlProvider } from "react-intl";
import SideNav from "../components/SideNav";
import UserContext from "../components/UserContext";

let messagesEn = require("../i18n/messages-en.json");

function MyApp({ Component, pageProps }: AppProps) {
  const [initialised, setInitialised] = useState(false);
  const [user, setUser] = useState<any>({});


  useEffect(() => {
    const init = async () => {
      const auth = getAuth();
      const result = await getRedirectResult(auth);
      if (!auth.currentUser) {
        await signInWithRedirect(auth, provider);
      } else {
        setUser(auth.currentUser);
      }
      setInitialised(true);
    };
    init();
  });

  return (
    <ChakraProvider>
      <IntlProvider messages={messagesEn} locale="en" defaultLocale="en">
        <UserContext.Provider value={user}>
        <SideNav />
        <Center paddingTop={"16px"} backgroundColor="blackAlpha.900">
          {initialised ? (
            <Component {...pageProps} />
          ) : (
            <Flex
              style={{
                justifyContent: "center",
                height: "100vh",
                alignItems: "center",
              }}
            >
              <Spinner />
            </Flex>
          )}
        </Center>
        </UserContext.Provider>
      </IntlProvider>
    </ChakraProvider>
  );
}

export default MyApp;