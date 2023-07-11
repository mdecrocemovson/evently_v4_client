import moment from "moment";
import React, { useEffect } from "react";
import { View, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { Image as ImageComponent } from "react-native";
import { BackgroundImage, Button, Image, Text } from "@rneui/base";
import EventlyText from "../../components/EventlyText/EventlyText";

import { useLazyQuery, useMutation } from "@apollo/client";
import { queries } from "../../data/queries";
// import { GetEventsByUserIdQuery } from "../../generated/graphql";
import { helpers } from "../../data/helpers";
import { discoverEvents, events } from "./eventData";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList, useNavigationProps } from "../../container/Portal";

const eventTypes = {
  music: "Music",
  food: "Food",
  sports: "Sports",
  arts: "Arts",
  outdoors: "Outdoors",
};

const Events = () => {
  const activeUser = helpers.useGetActiveUser();
  console.log(activeUser, "activeUser");
  const navigation = useNavigation<useNavigationProps>();
  const [selectedEventCategory, setSelectedEventCategory] = React.useState(
    eventTypes.music
  );

  const useFetchEvents = () =>
    useLazyQuery(queries.GET_EVENTS_BY_USER_ID, {
      onCompleted: () => console.log("events fetched"),
      onError: () => console.log("error fetching events"),
    });

  const [fetchEvents, { called, loading, data }] = useFetchEvents();

  useEffect(() => {
    if (activeUser) {
      fetchEvents({
        variables: {
          iduser: activeUser.id,
        },
      });
    }
  }, [activeUser]);

  console.log(data, called, "data called");

  return (
    <>
      <ScrollView style={styles.container}>
        <View
          style={{
            paddingTop: 50,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ paddingLeft: 20 }}></View>
          <View>
            <EventlyText style={{ fontSize: 24 }}>Evently</EventlyText>
          </View>
          <View>
            <Icon
              onPress={(e) => navigation.navigate("CreateEvent")}
              size={30}
              name="add"
              color="white"
            />
          </View>
        </View>

        <View style={{ paddingTop: 40 }}>
          <View>
            {loading ? (
              <Text>Loading</Text>
            ) : (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{ maxHeight: 350, marginLeft: 20 }}
              >
                {data?.eventsByUserId.map((event: any, index: number) => {
                  const goingResponses = event.responses.filter(
                    (e) => e.response === 1
                  );
                  const maybeResponses = event.responses.filter(
                    (e) => e.response === 2
                  );
                  return (
                    <View style={{ marginRight: 25, paddingTop: 10 }}>
                      <Image
                        onPress={() =>
                          navigation.navigate("Event", { eventId: event.id })
                        }
                        source={{ uri: event.coverPhoto }}
                        style={styles.card}
                      >
                        <View
                          style={{
                            position: "relative",
                            top: 230,
                          }}
                        >
                          <EventlyText
                            fontFamily={"promptSemiBold"}
                            style={styles.eventTitle}
                          >
                            {event.title}
                          </EventlyText>
                          <EventlyText style={styles.eventSubTitle}>
                            {moment(event.endDate).format(
                              "MMMM Do [at] hh:mma"
                            )}
                          </EventlyText>
                          <EventlyText style={styles.eventLocation}>
                            {event.location}
                          </EventlyText>
                          <EventlyText style={styles.eventAttendance}>
                            Going {goingResponses.length} Maybe{" "}
                            {maybeResponses.length}
                          </EventlyText>
                        </View>
                      </Image>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
          <EventlyText style={styles.exploreEventsCTA}>
            Explore More Events
          </EventlyText>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={styles.discoverButtonsContainer}
            horizontal
          >
            {Object.values(eventTypes).map((e) => (
              <Button
                onPress={() => setSelectedEventCategory(e)}
                titleStyle={styles.eventTypeButtonTitle}
                buttonStyle={
                  e === selectedEventCategory
                    ? selectedButtonStyles
                    : styles.eventTypeButton
                }
              >
                <EventlyText>{e}</EventlyText>
              </Button>
            ))}
          </ScrollView>
          {discoverEvents
            .filter((e) => e.category === selectedEventCategory)
            .map((event) => (
              <View style={styles.discoverEvent}>
                <ImageComponent
                  style={styles.discoverEventImage}
                  source={event.image}
                />
                <View style={styles.discoverEventTexts}>
                  <EventlyText
                    style={{ ...styles.eventTitle, fontSize: 14 }}
                    fontFamily={"promptSemiBold"}
                  >
                    {event.name}
                  </EventlyText>
                  <EventlyText
                    style={{ ...styles.eventSubTitle, marginTop: 5 }}
                  >
                    {event.date.format("MMM Do[,] hh:mma")}
                  </EventlyText>
                  <EventlyText>{event.location}</EventlyText>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </>
  );
};

export const styles = StyleSheet.create({
  discoverButtonsContainer: {
    marginLeft: 20,
    marginBottom: 20,
  },

  eventTypeButton: {
    width: 132,
    height: 40,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 17,
  },

  eventTypeButtonTitle: {
    color: "#FFFFFF",
  },
  exploreEventsCTA: {
    fontSize: 20,
    marginBottom: 22,
    marginLeft: 20,
  },
  discoverEventTexts: {
    justifyContent: "center",
    width: "60%",
  },
  discoverEventImage: {
    height: 85,
    width: 150,
  },
  discoverEvent: {
    flexDirection: "row",
    marginBottom: 10,
  },
  container: {
    // paddingTop: 130,
    paddingHorizontal: 20,
    backgroundColor: "#060606",
    height: "100%",
  },
  card: {
    height: 315,
    width: 270,
    borderRadius: 20,
  },
  eventTitle: {
    fontSize: 18,
    lineHeight: 20,
  },
  eventSubTitle: {
    color: "#0195A4",
    fontSize: 12,
    lineHeight: 15,
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.05,
    marginBottom: 3,
  },
  eventAttendance: {
    fontSize: 10,
  },
});

const selectedButtonStyles = {
  ...styles.eventTypeButton,
  borderColor: "#FFFFFF",
  borderWidth: 1,
  backgroundColor: "black",
};
export default Events;
