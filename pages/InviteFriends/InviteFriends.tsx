import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { EventlyText } from "../../components/EventlyComponents";
import { useNavigationProps } from "../../container/Portal";
import { useNavigation } from "@react-navigation/native";
import Friend from "../../components/Friend/Friend";
import { helpers } from "../../data/helpers";
import { useState } from "react";

const InviteFriends = () => {
  const navigation = useNavigation<useNavigationProps>();
  const activeUser = helpers.useGetActiveUser();

  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  console.log(selectedFriends, "selectedFriends");
  return (
    <View
      style={{
        backgroundColor: "#060606",
        height: "100%",
        paddingTop: 80,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <Icon
          onPress={() => navigation.goBack()}
          style={{ position: "relative", left: 30 }}
          size={25}
          color="white"
          name="arrow-back"
        />
        <View>
          <EventlyText>Invite Friends</EventlyText>
        </View>
        <View></View>
      </View>
      {activeUser &&
        activeUser.friends &&
        activeUser.friends.map(({ friend }: { friend: TFriend }) => (
          <Friend
            unselectFriend={(e) =>
              setSelectedFriends(
                selectedFriends.filter((friendId) => friendId !== e)
              )
            }
            isSelect
            friend={friend}
            selectedFriends={selectedFriends}
            selectFriend={(e) => setSelectedFriends([...selectedFriends, e])}
            showLocation
          />
        ))}
    </View>
  );
};

export default InviteFriends;
