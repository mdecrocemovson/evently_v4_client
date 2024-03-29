import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useEffect, useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Toast from "react-native-root-toast";
import * as ImagePicker from "expo-image-picker";

import { RootStackParamList } from "../../container/Portal";
// import Text from "../../components/Text/Text";
import { helpers } from "../../data/helpers";
import { ProfileInput } from "./Profile.styles";
import { storage } from "../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Loading from "../../components/Loading/Loading";
import EventlyText from "../../components/EventlyText/EventlyText";
import { getAuth, signOut } from "firebase/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

const Profile = ({ navigation }: Props) => {
  const auth = getAuth();

  const activeUser = helpers.useGetActiveUser();
  console.log(activeUser, "activeUser");
  const [uploading, setUploading] = useState(false);

  const storageRef = ref(storage, `/files/${activeUser?.firstName}/avatar.png`);
  const [user, setUser] = useState({
    firstName: activeUser?.firstName || "",
    lastName: activeUser?.lastName || "",
    location: activeUser?.location || "",
    bio: activeUser?.bio || "",
    email: "",
  });

  const handleChange = (type, value) => {
    setUser((prevState) => ({ ...prevState, [type]: value }));
  };

  const [updateUserAttributes, { loading }] = helpers.useUpdateUserAttributes(
    activeUser?.id
  );

  const openImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setUploading(true);

    if (!result.canceled) {
      const message2 = result.uri;
      const response = await fetch(message2);

      const blob = await response.blob();
      try {
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        await updateUserAttributes({
          variables: {
            input: {
              id: activeUser!.id,
              profilePhoto: downloadUrl,
            },
          },
        });
      } catch (err) {
        console.log(err, "error");
      }
    }
    setUploading(false);
  };

  if (loading || uploading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.profile}>
      <>
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={() => {
            console.log("yeet");
          }}
        >
          <Icon
            // containerStyle={{
            //   position: "absolute",
            //   top: 70,
            //   left: 30,
            //   borderWidth: 1,
            //   borderColor: "rgba(255, 255, 255, 0.4",
            // }}
            data-name="arrow-left"
            onPress={() => navigation.goBack()}
            // iconStyle={{ color: "#FFFFFF" }}
            name="arrow-left"
            // type="font-awesome"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openImage()}
          style={styles.avatarContainer}
        >
          <Image
            source={{
              uri:
                activeUser?.profilePhoto ||
                "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <EventlyText style={styles.titleFullName}>
            {user?.firstName} {user?.lastName}
          </EventlyText>
        </View>
        <View style={styles.profileInfo}>
          <TouchableOpacity
            style={styles.profileInfoBox}
            onPress={(e) => navigation.navigate("Events")}
          >
            <EventlyText style={styles.profileInfoBoxNumber}>
              {activeUser?.events?.length}
            </EventlyText>
            <EventlyText
              fontFamily={"cabinCondensedMedium"}
              style={styles.profileInfoBoxLabel}
            >
              Events Hosted
            </EventlyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => navigation.navigate("MyFriends")}
            style={{
              ...styles.profileInfoBox,
              borderLeftWidth: 1,
              borderLeftColor: "#FFFFFF",
            }}
          >
            <EventlyText style={styles.profileInfoBoxNumber}>
              {activeUser?.friends?.length}
            </EventlyText>
            <EventlyText
              fontFamily={"cabinCondensedMedium"}
              style={styles.profileInfoBoxLabel}
            >
              Friends
            </EventlyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => navigation.navigate("Events")}
            style={{
              ...styles.profileInfoBox,
              borderLeftWidth: 1,
              borderLeftColor: "#FFFFFF",
            }}
          >
            <EventlyText style={styles.profileInfoBoxNumber}>
              {activeUser?.events.length}
            </EventlyText>
            <EventlyText
              fontFamily={"cabinCondensedMedium"}
              style={styles.profileInfoBoxLabel}
            >
              Events Attended
            </EventlyText>
          </TouchableOpacity>
        </View>

        <ProfileInput
          onChangeText={(e) => handleChange("firstName", e)}
          value={user.firstName}
          label={"First Name"}
          icon={{ name: "badge" }}
        />
        <ProfileInput
          onChangeText={(e) => handleChange("lastName", e)}
          value={user.lastName}
          label={"Last Name"}
          icon={{ name: "account-circle" }}
        />
        <ProfileInput
          onChangeText={(e) => handleChange("location", e)}
          value={user.location}
          label={"Location"}
          icon={{ name: "place" }}
        />
        <ProfileInput
          onChangeText={(e) => handleChange("bio", e)}
          value={user.bio}
          label={"Bio"}
          multiline
          icon={{ name: "contact-page" }}
        />

        <Button
          buttonStyle={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            height: 54,
            marginVertical: 40,
            marginHorizontal: 33,
          }}
          titleStyle={{ color: "#000000", fontWeight: "500" }}
          onPress={() => {
            const { firstName, lastName, location, bio } = user;
            updateUserAttributes({
              variables: {
                input: {
                  id: activeUser?.id,
                  firstName,
                  lastName,
                  location,
                  bio,
                },
              },
            });
            Toast.show("Profile Updated!", {
              duration: Toast.durations.SHORT,
              position: Toast.positions.TOP,
            });
          }}
          title="Save"
        />
        <Button
          buttonStyle={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            height: 54,
            marginBottom: 10,
            marginHorizontal: 33,
          }}
          titleStyle={{ color: "#000000", fontWeight: "500" }}
          onPress={async () => {
            await signOut(auth)
              .then(() => {
                // Sign-out successful.
              })
              .catch((error) => {
                // An error happened.
              });
          }}
          title="Sign Out"
        />
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profile: {
    backgroundColor: "#060606",
    height: "100%",
  },
  loading: {
    marginTop: 200,
  },
  avatar: {
    width: 124,
    height: 124,
    marginTop: 60,
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

  profileInfo: {
    flexDirection: "row",
  },
  profileInfoBox: {
    alignItems: "center",
    minHeight: 90,
    justifyContent: "center",
    alignContent: "center",
    display: "flex",
    width: "33%",
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
});

export default Profile;
