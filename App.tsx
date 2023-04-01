import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { persistCache } from "apollo3-cache-persist";

import Portal from "./container/Portal";

import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const cache = new InMemoryCache();
  const cacheFix = async () => {
    await persistCache({
      cache,
      storage: AsyncStorage,
    });
  };
  useEffect(() => {
    cacheFix();
  }, []);

  const client = new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {/* <DatesProvider settings={{ weekendDays: [0, 6] }}> */}
      <NavigationContainer>
        <Portal />
      </NavigationContainer>
      {/* </DatesProvider> */}
    </ApolloProvider>
  );
};

export default App;
