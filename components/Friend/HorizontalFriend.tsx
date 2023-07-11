import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/base";
import EventlyText from "../EventlyText/EventlyText";
import { TFriend } from "../../pages/CreateEvent/CreateEvent";

export type HorizontalFriendProps = {
  friend: TFriend;
  onPress?: () => void;
};

const HorizontalFriend = ({ friend, onPress }: HorizontalFriendProps) => {
  console.log(friend, "friend");
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.friendContainer}
      key={friend.id}
    >
      <Image
        // containerStyle={{ width: 54, height: 54, marginBottom: 10 }}
        source={{ uri: friend.profilePhoto }}
        style={{ width: 54, height: 54, marginBottom: 10 }}
      />
      <EventlyText fontFamily="promptSemiBold">
        {friend.firstName} {friend.lastName}
      </EventlyText>
      <EventlyText style={{ opacity: 0.7, fontSize: 12 }}>
        {friend.location}
      </EventlyText>
      <EventlyText style={styles.friendIndicator}>
        {friend.isFriend ? (
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={styles.dot}>{"\u2B24"}</Text>
            <Text style={{ color: "#0195A4" }}>Friend</Text>
          </View>
        ) : null}
      </EventlyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dot: {
    fontSize: 6,
    color: "#0195A4",
    marginTop: 3,
    marginRight: 5,
  },
  friendContainer: {
    width: 124,
    height: 160,
    borderRadius: 15,
    backgroundColor: "#1E1E1E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  friendIndicator: {
    color: "#0195A4",
    marginTop: 5,
  },
});

export default HorizontalFriend;
