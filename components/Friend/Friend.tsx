import { Button } from "@rneui/base";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, CheckBox } from "react-native-elements";
import EventlyText from "../EventlyText/EventlyText";

interface IFriendProps {
  friend: any;
  isSelect?: boolean;
  isAddFriend?: boolean;
  selectedFriends?: any;
  selectFriend?: (id: number) => void;
  showLocation?: boolean;
  showEventAttended?: boolean;
  addFriend?: (id: number) => void;
}

const Friend = ({
  friend,
  isSelect,
  isAddFriend,
  selectedFriends,
  selectFriend,
  showLocation,
  showEventAttended,
  addFriend,
}: IFriendProps) => {
  console.log(friend, "friend");
  return (
    <View key={friend.id} style={styles.friend}>
      <View style={styles.friendDetails}>
        <Avatar source={friend.profilePhoto} containerStyle={styles.avatar} />
        <View>
          <EventlyText style={{ fontSize: 16 }}>
            {friend.firstName} {friend.lastName}
          </EventlyText>
          {showLocation && (
            <EventlyText
              fontFamily="cabinCondensedMedium"
              style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}
            >
              {friend.location}
            </EventlyText>
          )}
          {showEventAttended && (
            <EventlyText
              fontFamily="cabinCondensedMedium"
              style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}
            >
              {friend.eventAttended}
            </EventlyText>
          )}
        </View>
      </View>
      {isAddFriend && (
        <Button
          buttonStyle={{
            backgroundColor: "#FFFFFF",
            height: 32,
            marginTop: 8,
            width: 100,
            borderRadius: 12,
          }}
          title={<EventlyText fontFamily="promptMedium" />}
          titleStyle={{
            fontSize: 12,
            color: "#000000",
          }}
          onPress={() => {
            if (addFriend) addFriend(friend.id);
          }}
        >
          Add Friend
        </Button>
      )}
      {isSelect && (
        <CheckBox
          checked={selectedFriends.includes(friend.id)}
          onPress={() => {
            if (selectFriend) selectFriend(friend.id);
          }}
        />
      )}
    </View>
  );
};

export default Friend;

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    marginRight: 10,
  },

  friend: {
    display: "flex",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,

    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    justifyContent: "space-between",
  },
  friendDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
});
