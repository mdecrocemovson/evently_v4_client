import React, { useEffect, useMemo, useReducer, useState } from "react";
import { EventlyText, Loading } from "../../components/EventlyComponents";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { Button } from "@rneui/base";
import eventImage from "../../assets/eventImage.png";
import moment from "moment";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../container/Portal";
import { helpers } from "../../data/helpers";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { randomId } from "@mantine/hooks";
import { updateAttendance } from "./Event.helpers";
import HorizontalFriend from "../../components/Friend/HorizontalFriend";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TFriend } from "../CreateEvent/CreateEvent";

type Props = NativeStackScreenProps<RootStackParamList, "Event">;

type EventPhoto = {
  url?: string;
  id: string;
  user?: {
    id?: string;
  };
};

const Event = ({ route, navigation }: Props) => {
  const activeUser = helpers.useGetActiveUser();
  const storage = getStorage();

  const eventId = route.params.eventId || "clfriq9e20000wvy3dp32ifm8";
  const eventStorageRef = ref(
    storage,
    `/files/${eventId}/photos/${randomId()}`
  );

  const [uploading, setUploading] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<EventPhoto>({});

  const reducer = (state: any, action: { type: any; payload: any }) => {
    switch (action.type) {
      case "loadedEvent":
        return { ...action.payload };
      case "category":
      case "title":
      case "startDate":
      case "location":
      case "attendance":
      case "eventPhotos":
      case "description":
        return { ...state, [action.type]: action.payload };
    }
  };

  const [state, dispatch] = useReducer(reducer, {});
  const [userAttendance, setUserAttendance] = useState(1);

  const [fetchEventById, fetchEventByIdStatus] = helpers.useFetchEventById({
    input: {
      id: eventId,
      activeUserId: activeUser?.id,
    },
  });
  const [updateEvent, updateEventStatus] = helpers.useUpdateEvent();
  const [updateUserAttendance, updateUserAttendanceStatus] =
    helpers.useUpdateUserAttendance();

  useEffect(() => {
    if (eventId) {
      fetchEventById();
    }
  }, []);

  useEffect(() => {
    if (fetchEventByIdStatus.data && !fetchEventByIdStatus.loading) {
      // have to remove the typename while it's in the frontend.
      const { eventPhotos } = fetchEventByIdStatus.data.eventById;
      let sanitizedEventPhotos;
      if (eventPhotos && eventPhotos.length > 0) {
        // it may be undefined, in which case we should cast it as an empty array.
        sanitizedEventPhotos = eventPhotos.map((photo: any) => {
          delete photo.__typename;
          delete photo.user.__typename;
          delete photo.user.firstName;
          delete photo.user.lastName;
          return {
            ...photo,
          };
        });
      }

      dispatch({
        type: "loadedEvent",
        payload: {
          ...fetchEventByIdStatus.data.eventById,
          eventPhotos: sanitizedEventPhotos || [],
        },
      });
    }
  }, [fetchEventByIdStatus]);

  console.log(state);

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
      const message2 = result.assets[0].uri;
      const response = await fetch(message2);

      const blob = await response.blob();
      try {
        const snapshot = await uploadBytes(eventStorageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        setCurrentPhoto({
          id: randomId(),
          url: downloadUrl,
          user: { id: activeUser?.id },
        });
        setIsAddPhotoModalOpen(true);
      } catch (err) {
        console.log(err, "error");
      }
    }
    setUploading(false);
  };

  const { attendingResponses, maybeResponses, notAttendingResponses } =
    useMemo(() => {
      return {
        attendingResponses: state?.responses?.filter(
          (response: any) => response.response === 1
        ),
        maybeResponses: state?.responses?.filter(
          (response: any) => response.response === 2
        ),
        notAttendingResponses: state?.responses?.filter(
          (response: any) => response.response === 3
        ),
      };
    }, [state.responses]);

  console.log(attendingResponses, "attendingResponses");

  const savePhoto = () => {
    dispatch({
      type: "eventPhotos",
      payload: [...state.eventPhotos, currentPhoto],
    });
    setIsAddPhotoModalOpen(false);
    // update event with photo
    updateEvent({
      variables: {
        input: {
          id: eventId,
          userId: activeUser?.id,
          eventPhotos: [...state.eventPhotos, currentPhoto],
        },
      },
    });
  };

  const updateAttendanceProps = {
    eventId,
    userId: activeUser?.id,
    setUserAttendance,
    updateUserAttendance,
  };

  const attendanceOptions = [
    { attendanceValue: 1, title: "Going" },
    { attendanceValue: 2, title: "Not Going" },
    { attendanceValue: 3, title: "Maybe" },
  ];

  const addEventToCalendar = async () => {
    // console.log("add event to calendar");
    // try {
    //   const defaultCalendar = await (
    //     await Calendar.getDefaultCalendarAsync()
    //   ).source;
    //   const newCalendarID = await Calendar.createCalendarAsync({
    //     title: "Expo Calendar",
    //     color: "blue",
    //     entityType: Calendar.EntityTypes.EVENT,
    //     sourceId: defaultCalendar.id,
    //     source: defaultCalendar,
    //     name: "internalCalendarName",
    //     ownerAccount: "personal",
    //     accessLevel: Calendar.CalendarAccessLevel.OWNER,
    //   });
    // } catch (err) {
    //   console.log(err, "error");
    // }
  };

  const shareEvent = async () => {
    console.log("sharing??");
    try {
      const result = await Share.share({
        title: "Check out this great event on Evently!",
        message: state.title,
        url: "https://dev.to/urakymzhan/react-native-simulator-debugging-shortcut-4d27",
      });
      console.log(result, "result");
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (err: any) {
      // better alert
      Alert.alert(err.message);
    }
  };

  const inviteFriendUser: TFriend = {
    firstName: "Invite More Friends!",
    profilePhoto: "https://i.imgur.com/7k12EPD.png",
    location: "",
    id: 1,
    lastName: "",
    eventAttended: "",
    isFriend: false,
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.event}>
      {fetchEventByIdStatus.loading ? (
        <Loading />
      ) : (
        <View>
          <View>
            <Icon
              onPress={(e) => navigation.goBack()}
              style={{ position: "absolute", top: 70, left: 20, zIndex: 1000 }}
              name="arrow-back"
              size={25}
              color="white"
            />
            <Icon
              onPress={() => shareEvent()}
              style={{ position: "absolute", top: 70, right: 20, zIndex: 1000 }}
              name="ios-share"
              size={25}
              color="white"
            />
            <Image
              // containerStyle={{ backgroundColor: "black" }}
              // onPress={() => openImage()}
              source={{ uri: state.coverPhoto }}
              style={styles.image}
            />
            <View
              style={{ position: "absolute", bottom: 10, right: 10, left: 10 }}
            >
              <EventlyText style={{ fontSize: 18 }}>
                {state.title || "No Title"}
              </EventlyText>
              <EventlyText style={{ color: "#0195A4" }}>
                {moment(state.startDate)?.format("MMM Do")} at{" "}
                {moment(state.startDate)?.format("hh:mma")}
              </EventlyText>
              <EventlyText>
                <EventlyText style={styles.attendanceText}>
                  Going: {attendingResponses?.length}
                </EventlyText>{" "}
                <EventlyText style={styles.attendanceText}>
                  Maybe: {maybeResponses?.length}
                </EventlyText>
                <EventlyText style={styles.attendanceText}>
                  Not Coming: {notAttendingResponses?.length}
                </EventlyText>
              </EventlyText>
              <EventlyText style={styles.attendanceText}>
                {state?.location}
              </EventlyText>
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 10,
                right: 20,
                backgroundColor: "black",
                borderRadius: 30,
              }}
            >
              <Button
                buttonStyle={{
                  backgroundColor: "black",
                  borderRadius: 30,
                  width: 65,
                }}
              >
                <EventlyText>
                  {state.category?.charAt(0).toUpperCase() +
                    state.category?.slice(1)}
                </EventlyText>
              </Button>
            </View>
          </View>
          <View style={styles.bottomSection}>
            <View style={{ marginBottom: 10 }}>
              <View style={styles.descriptionContainer}>
                <EventlyText
                  style={{ fontSize: 16 }}
                  fontFamily="promptSemiBold"
                >
                  Description
                </EventlyText>
                <TouchableOpacity onPress={(e) => addEventToCalendar()}>
                  <EventlyText
                    style={{
                      ...styles.linkText,
                      textDecorationLine: "underline",
                    }}
                  >
                    <Icon
                      style={{ ...styles.linkText, marginRight: 2 }}
                      name="event"
                    />
                    Add To Calendar
                  </EventlyText>
                </TouchableOpacity>
              </View>
              <EventlyText
                style={{ opacity: 0.7 }}
                fontFamily="cabinCondensedMedium"
              >
                {state.description || "No Description"}
              </EventlyText>
            </View>
            <View style={styles.descriptionContainer}>
              <EventlyText style={{ fontSize: 16 }} fontFamily="promptSemiBold">
                People Attending
              </EventlyText>
              <EventlyText
                fontFamily="promptSemiBold"
                style={{ ...styles.linkText, marginTop: 5 }}
              >
                {attendingResponses?.length} Attending
              </EventlyText>
            </View>

            <View style={{ display: "flex", flexDirection: "row" }}>
              {attendingResponses && attendingResponses?.length > 0 ? (
                <>
                  {attendingResponses?.map((r: { user: any }) => {
                    return <HorizontalFriend key={r.user.id} friend={r.user} />;
                  })}
                  <HorizontalFriend
                    onPress={() => navigation.navigate("InviteFriends")}
                    friend={inviteFriendUser}
                  />
                </>
              ) : (
                <EventlyText>No one is attending yet</EventlyText>
              )}
            </View>
            <View
              style={{
                ...styles.descriptionContainer,
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              <EventlyText style={{ fontSize: 16 }} fontFamily="promptSemiBold">
                Event Photos
              </EventlyText>
            </View>
            <View
              style={{
                marginVertical: 20,
                display: "flex",
                flexDirection: "row",
              }}
            >
              {state.eventPhotos && state.eventPhotos.length ? (
                // TODO - add photo type
                state.eventPhotos.map((photo: any) => (
                  <Image
                    key={photo.url}
                    style={{ width: 130, height: 130 }}
                    source={{ uri: photo.url }}
                  />
                ))
              ) : (
                <EventlyText>No photos yet</EventlyText>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              <Button
                buttonStyle={{
                  ...styles.attendanceSelector,
                  borderWidth: 1,
                  backgroundColor: "#050505",
                }}
                titleStyle={{ color: "#FFFFFF", fontWeight: "500" }}
                onPress={(e) => openImage()}
                title="Add new photo"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              {attendanceOptions.map((option, index) => (
                <Button
                  key={option.attendanceValue}
                  containerStyle={{
                    flex: 1,
                    marginRight:
                      index !== attendanceOptions.length - 1 ? 10 : 0,
                  }}
                  buttonStyle={{
                    ...styles.attendanceSelector,

                    backgroundColor:
                      userAttendance === option.attendanceValue
                        ? "#FFFFFF"
                        : "#050505",
                  }}
                  titleStyle={{
                    fontWeight: "500",
                    color:
                      userAttendance === option.attendanceValue
                        ? "#050505"
                        : "#FFFFFF",
                  }}
                  onPress={(e) =>
                    updateAttendance({
                      ...updateAttendanceProps,
                      attendance: option.attendanceValue,
                    })
                  }
                  title={option.title}
                />
              ))}
            </View>
          </View>
        </View>
      )}

      <Modal
        style={{ backgroundColor: "#000000" }}
        presentationStyle="fullScreen"
        animationType="slide"
        // transparent={true}
        visible={isAddPhotoModalOpen}
        onRequestClose={() => {
          setIsAddPhotoModalOpen(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <EventlyText style={{ marginBottom: 20 }}>New Photo</EventlyText>
            <Image
              style={{ width: "300px", height: "200px", marginBottom: 20 }}
              source={{ uri: currentPhoto.url }}
            />
            <Button title="Save Photo" onPress={() => savePhoto()} />
            <Button
              title="Cancel"
              onPress={() => setIsAddPhotoModalOpen(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  event: {
    backgroundColor: "#060606",
    height: "100%",
    // paddingTop: 20,
  },
  descriptionContainer: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  bottomSection: {
    padding: 10,
  },
  linkText: {
    color: "#0195A4",
    fontSize: 12,
  },
  image: {
    height: 315,
    width: "100%",
    resizeMode: "cover",
  },
  attendanceText: {
    fontSize: 12,
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
  attendanceSelector: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    shadowColor: "#000",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

export default Event;
