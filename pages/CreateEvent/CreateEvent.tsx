import React, { useReducer, useState } from "react";
import { View, ScrollView, ImageSourcePropType } from "react-native";
import { Avatar } from "react-native-elements";
import Toast from "react-native-root-toast";
import DropDownPicker from "react-native-dropdown-picker";
import AddPhoto from "../../assets/AddPhoto.png";
import moment, { Moment } from "moment";
import { RootStackParamList } from "../../container/Portal";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { helpers } from "../../data/helpers";
import { EventlyInput, EventlyText } from "../../components/EventlyComponents";
import { StyleSheet } from "react-native";
import {
  BackIcon,
  createEventStyles,
  InviteButton,
  ProfileInput,
} from "../Event/Event.styled";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Friend from "../../components/Friend/Friend";
import EventlyDatePicker from "../../components/EventlyDatePicker/EventlyDatePicker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export type TFriend = {
  location: string;
  id: number;
  firstName: string;
  lastName: string;
  eventAttended: string;
  profilePhoto: ImageSourcePropType;
  isFriend: boolean;
};

type Event = {
  title: string;
  description: string;
  category: string;
  startDate: Moment;
  endDate: Moment;
  location: string;
};

type Props = NativeStackScreenProps<RootStackParamList, "CreateEvent">;

const CreateEvent = ({ navigation }: Props) => {
  const [uploading, setUploading] = useState(false);
  const storage = getStorage();
  const activeUser = helpers.useGetActiveUser();
  console.log(activeUser, "activeUser");

  const [downloadUrl, setDownloadUrl] = useState("");
  const [event, setEvent] = useState<Event>({
    title: "",
    description: "",
    category: "",
    startDate: moment(),
    endDate: moment(),
    location: "",
  });
  const [selectedFriends, setSelectedFriends] = useState<TFriend[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const storageRef = ref(storage, `/files/${activeUser}/events`);

  const categories = [
    { label: "Dancing", value: "dancing" },
    { label: "Drinking", value: "drinking" },
    { label: "Eating", value: "eating" },
    { label: "Gaming", value: "gaming" },
  ];

  const selectFriend = (id: any) => {
    const filteredFriends = selectedFriends.filter(
      (friendId: any) => friendId !== id
    );
    setSelectedFriends(
      selectedFriends.includes(id) ? filteredFriends : [...selectedFriends, id]
    );
  };

  const [createEvent, createEventStatus] = helpers.useCreateEvent();

  const openImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setUploading(true);

    if (!result.canceled) {
      // @ts-ignore
      const message2 = result.uri;
      const response = await fetch(message2);

      const blob = await response.blob();
      try {
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        setDownloadUrl(downloadUrl);
      } catch (err) {
        console.log(err, "error");
      }
    }
    setUploading(false);
  };

  console.log(event, "event");

  return (
    <ScrollView style={styles.profile}>
      <BackIcon
        onPress={() => navigation.goBack()}
        containerStyle={createEventStyles.backIcon}
        iconStyle={{ color: "white" }}
        name="arrow-left"
        type="font-awesome"
      />
      <View style={styles.avatarContainer}>
        <Avatar
          onPress={() => openImage()}
          source={downloadUrl ? { uri: downloadUrl } : AddPhoto}
          containerStyle={styles.avatar}
          rounded
        />
      </View>
      <View style={styles.titleContainer}>
        <EventlyText style={styles.titleFullName}>
          Let's Party, {activeUser?.firstName}!
        </EventlyText>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <EventlyInput
          icon={{ name: "badge" }}
          contained
          style={styles.profileInput}
          value={event?.title}
          label="Title of Event"
          onChangeText={(e) => setEvent({ ...event, title: e })}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 10,
            paddingBottom: 0,
            alignItems: "center",
          }}
        >
          <Icon
            style={{ color: "#F5F5F5", fontSize: 17, marginRight: 10 }}
            name={"category"}
          />

          <EventlyText>Event Category</EventlyText>
        </View>
        <View style={{ padding: 10, zIndex: 1000 }}>
          <DropDownPicker
            theme="DARK"
            dropDownContainerStyle={{
              backgroundColor: "#171717",
            }}
            style={{
              backgroundColor: "black",
              flex: 1,
              alignItems: "center",
              borderWidth: 0.5,
              zIndex: 1000,
              borderColor: "rgba(255, 255, 255, 0.5)",
              justifyContent: "center",
            }}
            textStyle={{ color: "white" }}
            open={isPickerOpen}
            value={event.category}
            items={categories}
            setOpen={() => setIsPickerOpen(true)}
            onClose={() => setIsPickerOpen(false)}
            setValue={(callback) => {
              setEvent({ ...event, category: callback(event?.category) });
            }}
          />
        </View>
        <ProfileInput
          icon={{ name: "badge" }}
          contained
          value={event?.description}
          label="Description"
          placeholder="Enter Description"
          onChangeText={(e) => setEvent({ ...event, description: e })}
          multiline
          numberOfLines={4}
        />
        <View style={{ marginHorizontal: 10 }}>
          <EventlyText>Start Date</EventlyText>

          <EventlyDatePicker
            date={event?.startDate?.toDate()}
            mode={"datetime"}
            onChange={(date: moment.MomentInput) =>
              setEvent({ ...event, startDate: moment(date) })
            }
          />
          <EventlyText style={{ marginTop: 20 }}>End Date</EventlyText>

          <EventlyDatePicker
            date={event?.endDate?.toDate() || new Date()}
            mode={"datetime"}
            onChange={(date: moment.MomentInput) => {
              setEvent({ ...event, endDate: moment(date) });
            }}
          />
        </View>
        <View style={{ margin: 10 }}>
          <EventlyText>Location</EventlyText>
          <GooglePlacesAutocomplete
            placeholder="Location"
            query={{
              key: "AIzaSyB5pdpvqViYHldGxN5Y0-24WtVYUMLH8eQ",
              language: "en", // language of the results
            }}
            styles={{
              textInput: {
                backgroundColor: "black",
                color: "white",
                borderWidth: 0.5,
                borderColor: "rgba(255, 255, 255, 0.5)",
                minHeight: 50,
              },
            }}
            onPress={(data, details = null) =>
              setEvent({ ...event, location: data.description })
            }
            onFail={(error) => console.error(error)}
            renderDescription={(row) => row.description} // custom description render
            requestUrl={{
              url: "https://maps.googleapis.com/maps/api",
              useOnPlatform: "web",
            }} // this in only required for use on the web. See https://git.io/JflFv more for details.
          />

          <View style={styles.friendSection}>
            <EventlyText style={{ fontSize: 16 }} fontFamily="promptMedium">
              Invite Friends
            </EventlyText>
            {activeUser &&
            activeUser.friends &&
            activeUser?.friends.length > 0 ? (
              activeUser?.friends.map((f: TFriend) => (
                <Friend
                  key={f.id}
                  friend={f.friend}
                  isSelect
                  selectedFriends={selectedFriends}
                  selectFriend={selectFriend}
                />
              ))
            ) : (
              <EventlyText>
                You don't have any friends yet. Lets go make some!.
              </EventlyText>
            )}
          </View>
          <InviteButton
            buttonStyle={createEventStyles.inviteButton}
            titleStyle={createEventStyles.inviteButtonTitle}
            onPress={async (e) => {
              const response = await createEvent({
                variables: {
                  input: {
                    userId: activeUser?.id || "clehkt6a50002wvxzchshz77g",
                    ...event,
                    privacy: "public",
                    selectedFriends,
                    coverPhoto: downloadUrl,
                  },
                },
              });
              Toast.show("Event created", {
                duration: Toast.durations.LONG,
              });
              navigation.navigate("Event", {
                eventId: response.data?.createEvent?.id,
              });
            }}
            title="Create Event"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateEvent;

export const styles = StyleSheet.create({
  profile: {
    paddingTop: 30,
    height: "100%",
    backgroundColor: "#060606",
  },
  avatar: {
    width: 48,
    height: 48,
    marginRight: 10,
    borderRadius: 100,
  },
  addPhoto: {
    width: 90,
    height: 90,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  titleContainer: {
    marginVertical: 33,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  profileInput: {
    marginTop: 20,
  },
  profileInfo: {
    flexDirection: "row",
  },
  profileInfoBox: {
    alignItems: "center",
    minHeight: 90,
    justifyContent: "center",
    alignContent: "center",
    display: "flex",
    width: 185,
    backgroundColor: "#1E1E1E",
  },
  profileInfoBoxNumber: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "600",
  },
  profileInfoBoxLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  titleFullName: {
    fontSize: 22,
  },
  icon: { color: "#F5F5F5", fontSize: 17, marginTop: 20 },
  rightIcon: {
    color: "#F5F5F5",
  },
  friendSection: {
    backgroundColor: "#1E1E1E",
    marginTop: 20,
  },
  friend: {
    display: "flex",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  friendDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
});
