import { Icon } from "@rneui/base";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import EventlyText from "../../components/EventlyText/EventlyText";
import Friend from "../../components/Friend/Friend";
import { friends } from "../../data/friends";

const MyFriendsAttended = () => {
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

  const addFriend = (id: number) => {
    console.log(id, "id??");
  };

  return (
    <ScrollView style={styles.myFriends}>
      <View style={styles.headerContainer}>
        <Icon
          containerStyle={styles.iconContainer}
          iconStyle={{ color: "#FFFFFF" }}
          name="arrow-back"
        />
        <Icon
          containerStyle={{
            position: "absolute",
            top: 5,
            right: 30,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.4",
          }}
          iconStyle={{ color: "#FFFFFF" }}
          name="add"
        />

        <EventlyText style={styles.header}>Friends</EventlyText>
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
      {friends.map((friend) => (
        <Friend
          addFriend={() => addFriend(friend.id)}
          friend={friend}
          showLocation
          showEventAttended
          isAddFriend
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  myFriends: {
    backgroundColor: "#060606",
    height: "100%",
  },

  header: {
    fontSize: 24,
    fontWeight: "600",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
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

export default MyFriendsAttended;
