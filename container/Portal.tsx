import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import CreateEvent from "../pages/CreateEvent/CreateEvent";
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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import InviteFriends from "../pages/InviteFriends/InviteFriends";

export type RootStackParamList = {
  AuthenticatedStack: undefined;
  SignUpIn: undefined;
  CreateEvent: undefined;
  Profile: undefined;
  Event: { eventId: string };
  MyFriends: undefined;
  MyFriendsAttended: undefined;
  Events: undefined;
  Friend: undefined;
  BaseTabs: undefined;
};

export type useNavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const Stack = createNativeStackNavigator<RootStackParamList>();

const Tabs = createBottomTabNavigator();

const labelStyle = {
  color: "white",
};

export const BaseTabs = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Event"
      screenOptions={{
        tabBarActiveBackgroundColor: "black",
        tabBarInactiveBackgroundColor: "black",
        tabBarLabelStyle: labelStyle,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        options={{
          tabBarIcon: () => (
            <Icon name="calendar-today" size={25} color="white" />
          ),
          tabBarLabel: "Events",
        }}
        name="Events"
        component={Events}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: () => (
            <Icon name="supervised-user-circle" size={25} color="white" />
          ),
          tabBarLabel: "My Friends",
        }}
        name="MyFriends"
        component={MyFriends}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: () => <Icon name="person" size={25} color="white" />,
          tabBarLabel: "Profile",
        }}
        name="Profile"
        component={Profile}
      />
    </Tabs.Navigator>
  );
};

const AuthenticatedStack = () => {
  const [user, loading, error] = useAuthState(auth);

  const client = useApolloClient();

  const setActiveUser = helpers.useSetActiveUser(client);
  const navigation = useNavigation();

  useEffect(() => {
    console.log(loading, !user, "at portal");
    // Perform any necessary actions when the user's authentication state changes
    // For example, you can redirect the user to a login screen if they are not authenticated
    if (!loading && !user) {
      // Redirect the user to the sign-in screen
      navigation.navigate("SignUpIn");
    } else if (user) {
      setActiveUser({
        variables: {
          email: user.email,
        },
      });
    }
  }, [user, loading]);

  return (
    <View style={styles.app}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="BaseTabs" component={BaseTabs} />
        <Stack.Screen name="CreateEvent" component={CreateEvent} />
        <Stack.Screen name="SignUpIn" component={SignUpIn} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="InviteFriends" component={InviteFriends} />
        <Stack.Screen
          name="Event"
          component={Event}
          initialParams={{ eventId: "clfriq9e20000wvy3dp32ifm8" }}
        />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="MyFriends" component={MyFriends} />
        <Stack.Screen name="MyFriendsAttended" component={MyFriendsAttended} />
        {/* <Stack.Screen name="Friend" component={Friend} /> */}
      </Stack.Navigator>
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
export default AuthenticatedStack;

const FakeProfile = () => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};
