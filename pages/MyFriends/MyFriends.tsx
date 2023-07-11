import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import EventlyText from "../../components/EventlyText/EventlyText";
import Friend from "../../components/Friend/Friend";
import { friends } from "../../data/friends";
import { helpers } from "../../data/helpers";
import { useApolloClient } from "@apollo/client";
import { TFriend } from "../CreateEvent/CreateEvent";
import { useNavigation } from "@react-navigation/native";
import { LoginManager } from "react-native-fbsdk-next";

// import * as Facebook from "expo-facebook";

const MyFriends = () => {
  const activeUser = helpers.useGetActiveUser();
  const cache = useApolloClient();

  const navigation = useNavigation();
  const [selectedButtonId, setSelectedButtonId] = useState(0);
  const options = [
    {
      name: "My Friends",
      id: 0,
    },
    {
      name: "People Attended",
      id: 1,
    },
  ];

  async function logIn() {
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
      }
    );
  }
  return (
    <ScrollView style={styles.myFriends}>
      <View style={styles.headerContainer}>
        <View>
          <Icon size={30} name="arrow-back" color="white" />
        </View>

        <EventlyText style={styles.header}>Friends</EventlyText>
        <View>
          <Icon
            // disabled={!request}
            onPress={(e) => {
              logIn();
            }}
            size={30}
            name="add"
            color="white"
          />
        </View>
      </View>
      <View style={styles.categoryButtons}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => setSelectedButtonId(option.id)}
            style={{
              ...styles.categoryButton,
              ...(selectedButtonId === option.id && {
                backgroundColor: "rgba(226, 96, 74, 0.18)",
              }),
            }}
          >
            <EventlyText>{option.name}</EventlyText>
          </TouchableOpacity>
        ))}
      </View>
      {activeUser &&
        activeUser.friends &&
        activeUser.friends.map(({ friend }: { friend: TFriend }) => (
          <Friend friend={friend} showLocation />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  myFriends: {
    backgroundColor: "#060606",
    height: "100%",
    paddingHorizontal: 30,
    paddingTop: 80,
  },

  header: {
    fontSize: 24,
    fontWeight: "600",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 23,
  },
  categoryButtons: {
    flexDirection: "row",
    padding: 17,
  },
  categoryButton: {
    marginRight: 10,
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    position: "absolute",
    top: 5,
    left: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4",
  },
});

export default MyFriends;
