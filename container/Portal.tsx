// import { View, StyleSheet } from "react-native";
// import { helpers } from "./data/helpers";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
// import Profile from "./pages/Profile/Profile";
// import Event from "./pages/Event/Event";
// import SignUpIn from "./pages/SignUp/SignUpIn";
// import Events from "./pages/Events/Events";
import CreateEvent from "../pages/CreateEvent/CreateEvent";
// import MyFriends from "./pages/MyFriends/MyFriends";
// import MyFriendsAttended from "./pages/MyFriends/MyFriendsAttended";

// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "./firebase";
// import { useEffect } from "react";
// import Loading from "./components/Loading";

import { useApolloClient } from "@apollo/client";
import { View, Text, StyleSheet } from "react-native";
import Profile from "../pages/Profile/Profile";
import SignUpIn from "../pages/SignUpIn/SignUpIn";
import Event from "../pages/Event/Event";
import Events from "../pages/Events/Events";
import MyFriends from "../pages/MyFriends/MyFriends";
import MyFriendsAttended from "../pages/MyFriends/MyFriendsAttended";
import { Loading } from "../components/EventlyComponents";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { helpers } from "../data/helpers";
import { useEffect } from "react";

export type RootStackParamList = {
  SignUpIn: undefined;
  CreateEvent: undefined;
  Profile: undefined;
  Event: { eventId: string };
  MyFriends: undefined;
  MyFriendsAttended: undefined;
  Events: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Portal = () => {
  const client = useApolloClient();
  const [user, loading, error] = useAuthState(auth);
  console.log(user, loading, "user, loading");

  const setActiveUser = helpers.useSetActiveUser(client);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      setActiveUser({
        variables: {
          email: user.email,
        },
      });
    }
  }, [user]);

  return (
    <View style={styles.app}>
      {loading ? (
        <Loading />
      ) : (
        <Stack.Navigator
          initialRouteName="Event"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="CreateEvent" component={CreateEvent} />
          <Stack.Screen name="SignUpIn" component={SignUpIn} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen
            name="Event"
            component={Event}
            initialParams={{ eventId: "clfriq9e20000wvy3dp32ifm8" }}
          />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="MyFriends" component={MyFriends} />
          <Stack.Screen
            name="MyFriendsAttended"
            component={MyFriendsAttended}
          />
        </Stack.Navigator>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    backgroundColor: "#060606",
    height: "100%",
    width: "100%",
  },
});
export default Portal;

const FakeProfile = () => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};
