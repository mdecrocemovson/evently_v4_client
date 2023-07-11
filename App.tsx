import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { persistCache } from "apollo3-cache-persist";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import Portal, { Stack } from "./container/Portal";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AuthenticatedStack from "./container/Portal";
import { helpers } from "./data/helpers";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import SignUpIn from "./pages/SignUpIn/SignUpIn";

const App = () => {
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    uri: "http://localhost:4000",
    cache,
  });

  const cacheFix = async () => {
    await persistCache({
      cache,
      storage: AsyncStorage,
    });
  };
  useEffect(() => {
    cacheFix();
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const [user] = useAuthState(auth);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="CreateEvent"
              screenOptions={{
                headerShown: false,
              }}
            >
              {user ? (
                <Stack.Screen
                  name="AuthenticatedStack"
                  component={AuthenticatedStack}
                />
              ) : (
                <Stack.Screen name="SignUpIn" component={SignUpIn} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </LocalizationProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
