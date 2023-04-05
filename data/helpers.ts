import {
  ApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
// import {
//   ActiveUserQuery,
//   CreateEventMutation,
//   GetEventByIdQuery,
//   GetEventsByUserIdQuery,
//   GetUserByEmailQuery,
//   GetUserByPhoneQuery,
// } from "../generated/graphql";
import { mutations } from "./mutations";
import { queries } from "./queries";
import { NavigationProp } from "@react-navigation/native";

export const helpers = {
  useGetActiveUser: () => {
    try {
      const activeUser = useQuery(queries.GET_ACTIVE_USER)?.data?.activeUser;
      return activeUser;
    } catch (err) {
      console.log("ERROR FETCHING ACTIVE USER", err);
    }
  },
  useSetActiveUser: (
    client: ApolloClient<object>,
    shouldRedirect = false,
    navigation = null as NavigationProp<any> | null
  ) =>
    useLazyQuery(queries.GET_USER_BY_EMAIl, {
      onCompleted: (data) => {
        client.writeQuery({
          query: queries.GET_ACTIVE_USER,
          data: {
            activeUser: data.userByEmail,
          },
        });
        if (shouldRedirect && navigation) navigation.navigate("MyFriends");
      },
      onError: (err) => console.log(err, "error setting active user"),
    })[0],
  useGetUserByPhone: () =>
    useLazyQuery(queries.GET_USER_BY_PHONE, {
      onCompleted: (data) => {
        console.log("got user:", data);
      },
      onError: (err) => console.log(err, "error getting user"),
    }),
  useFetchEventsByUserId: () =>
    useLazyQuery(queries.GET_EVENTS_BY_USER_ID, {
      onCompleted: (data) => {
        console.log("user events", data);
      },
    }),
  useFetchEventById: ({ input }: any) =>
    useLazyQuery(queries.GET_EVENT_BY_ID, {
      variables: { input },
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        console.log("event", data);
      },
    }),
  useCreateEvent: () =>
    useMutation(mutations.CREATE_EVENT, {
      onCompleted: () => console.log("event created"),
      onError: (err) => console.log(err),
    }),
  useUpdateEvent: () =>
    useMutation(mutations.UPDATE_EVENT, {
      onCompleted: () => console.log("event updated"),
      onError: (err) => console.log(err),
      update: (cache, { data }) => {
        console.log(data, "data");
        cache.writeQuery({
          query: queries.GET_EVENT_BY_ID,
          data: {
            eventById: data?.updateEvent,
          },
        });
      },
    }),
  useUpdateUserAttributes: (activeUserId: string) =>
    useMutation(mutations.UPDATE_USER_ATTRIBUTES, {
      onCompleted: () => console.log("user updated"),
      onError: (err) => console.log(err),
      update: (cache, { data }) => {
        console.log(data, "data");
        cache.writeQuery({
          query: queries.GET_ACTIVE_USER,
          data: {
            activeUser: data?.updateUserAttributes,
          },
        });
      },
      refetchQueries: [
        { query: queries.GET_ACTIVE_USER, variables: { activeUserId } },
      ],
    }),

  useUpdateUserAttendance: () =>
    useMutation(mutations.UPDATE_USER_ATTENDANCE, {
      onCompleted: () => console.log("user attendance updated"),
      onError: (err) => console.log(err),
    }),
};
