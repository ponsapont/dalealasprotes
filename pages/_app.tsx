import "../styles/globals.css";
import type { AppProps } from "next/app";
import { provider } from "../services/firebaseConfig";

import { getAuth, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { useEffect, useState } from "react";
import { Center, ChakraProvider, Container, extendTheme, Flex, Spinner } from "@chakra-ui/react";
import { IntlProvider } from "react-intl";
import SideNav from "../components/SideNav";

let messagesEn = require("../i18n/messages-en.json");

function MyApp({ Component, pageProps }: AppProps) {
  let [initialised, setInitialised] = useState(false);

  useEffect(() => {
    const init = async () => {
      const auth = getAuth();
      const result = await getRedirectResult(auth);
      if (!auth.currentUser) {
        await signInWithRedirect(auth, provider);
      }
      setInitialised(true);
    };
    init();
  });

  return (
    <ChakraProvider>
      <IntlProvider messages={messagesEn} locale="en" defaultLocale="en">
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
      </IntlProvider>
    </ChakraProvider>
  );
}

export default MyApp;
