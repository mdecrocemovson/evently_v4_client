import moment from "moment";
import React, { useEffect } from "react";
import { View, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { Image as ImageComponent } from "react-native";
import { Button, Image, Text } from "@rneui/base";
import EventlyText from "../../components/EventlyText/EventlyText";
import eventForEvents from "../../assets/EventForEvents1.png";
import discoverEvent1 from "../../assets/discoverImage.png";
import discoverEvent2 from "../../assets/discoverImage2.png";
import { useLazyQuery, useMutation } from "@apollo/client";
import { queries } from "../../data/queries";
// import { GetEventsByUserIdQuery } from "../../generated/graphql";
import { helpers } from "../../data/helpers";

const eventTypes = [
  { name: "Music", id: 1 },
  { name: "Social Party", id: 2 },
  { name: "Outdoors", id: 3 },
  { name: "Sports", id: 4 },
  { name: "Food", id: 5 },
  { name: "Other", id: 6 },
];

const events = [
  {
    name: "Breeze Music Festival",
    date: moment(),
    location: "Hard Rock Stadium",
    image: eventForEvents,

    attendance: {
      going: 7,
      maybe: 4,
      no: 15,
    },
  },
  {
    name: "Recording Academy's 63rd Annual GRAMMY Awards",
    date: moment(),
    location: "Los Angeles Convention Center",
    image: eventForEvents,
    attendance: {
      going: 7,
      maybe: 4,
      no: 15,
    },
  },
  {
    name: "Recording Academy's 63rd Annual GRAMMY Awards",
    date: moment(),
    location: "Los Angeles Convention Center",
    image: eventForEvents,
    attendance: {
      going: 7,
      maybe: 4,
      no: 15,
    },
  },
  {
    name: "Recording Academy's 63rd Annual GRAMMY Awards",
    date: moment(),
    location: "Los Angeles Convention Center",
    image: eventForEvents,
    attendance: {
      going: 7,
      maybe: 4,
      no: 15,
    },
  },
];

const discoverEvents = [
  {
    name: "Breeze Music Festival",
    date: moment(),
    location: "Hard Rock Stadium",
    image: discoverEvent1,

    attendance: {
      going: 7,
      maybe: 4,
      no: 15,
    },
  },
  {
    name: "Recording Academy's 63rd Annual GRAMMY Awards",
    date: moment(),
    location: "Los Angeles Convention Center",
    image: discoverEvent2,
    attendance: {
      going: 7,
      maybe: 4,
      no: 15,
    },
  },
];

const Events = () => {
  const activeUser = helpers.useGetActiveUser();
  const [selectedEventTypeButton, setSelectedEventTypeButton] =
    React.useState(0);

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
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        {loading ? (
          <Text>Loading</Text>
        ) : (
          <ScrollView horizontal style={{ maxHeight: 350, marginLeft: 20 }}>
            {data?.eventsByUserId.map((event: any, index: number) => {
              return (
                <View style={{ marginRight: 25, width: 250, paddingTop: 10 }}>
                  <Image source={event.coverPhoto} style={styles.card}>
                    <View
                      style={{
                        position: "relative",
                        top: 250,
                      }}
                    >
                      <EventlyText
                        fontFamily={"promptSemiBold"}
                        style={styles.eventTitle}
                      >
                        {event.title} {index}
                      </EventlyText>
                      <EventlyText style={styles.eventSubTitle}>
                        {moment(event.endDate).format("MMMM Do [at] hh:mma")}
                      </EventlyText>
                      <EventlyText style={styles.eventLocation}>
                        {event.location}
                      </EventlyText>
                      <EventlyText style={styles.eventAttendance}>
                        Going {event.responses.going} Maybe{" "}
                        {event.responses.maybe}
                      </EventlyText>
                    </View>
                  </Image>
                </View>
              );
            })}
          </ScrollView>
        )}
        {events.map((event) => (
          <Image source={event.image} style={styles.card}>
            <View style={{ position: "absolute", bottom: 40, left: 20 }}>
              <EventlyText
                fontFamily={"promptSemiBold"}
                style={styles.eventTitle}
              >
                {event.name}
              </EventlyText>
              <EventlyText style={styles.eventSubTitle}>
                {event.date.format("MMMM Do [at] hh:mma")}
              </EventlyText>
              <EventlyText style={styles.eventLocation}>
                {event.location}
              </EventlyText>
              <EventlyText style={styles.eventAttendance}>
                Going {event.attendance.going} Maybe {event.attendance.maybe}
              </EventlyText>
            </View>
          </Image>
        ))}
      </View>
      <EventlyText style={styles.exploreEventsCTA}>
        Explore More Events
      </EventlyText>
      <ScrollView style={styles.discoverButtonsContainer} horizontal>
        {eventTypes.map((e) => (
          <Button
            onPress={() => setSelectedEventTypeButton(e.id)}
            titleStyle={styles.eventTypeButtonTitle}
            buttonStyle={
              e.id === selectedEventTypeButton
                ? selectedButtonStyles
                : styles.eventTypeButton
            }
          >
            <EventlyText>{e.name}</EventlyText>
          </Button>
        ))}
      </ScrollView>
      {discoverEvents.map((event) => (
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
            <EventlyText style={{ ...styles.eventSubTitle, marginTop: 5 }}>
              {event.date.format("MMM Do[,] hh:mma")}
            </EventlyText>
            <EventlyText>{event.location}</EventlyText>
          </View>
        </View>
      ))}
    </ScrollView>
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
    backgroundColor: "#060606",
    height: "100%",
  },
  card: {
    height: 350,
    width: 300,
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
