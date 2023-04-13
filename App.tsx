import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { persistCache } from "apollo3-cache-persist";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import Portal from "./container/Portal";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <NavigationContainer>
            <Portal />
          </NavigationContainer>
        </LocalizationProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
