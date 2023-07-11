import gql from "graphql-tag";

export const mutations = {
  CREATE_EVENT: gql`
    mutation CreateEvent($input: CreateEventInput!) {
      createEvent(input: $input) {
        id
        title
        location
        length
        description
        coverPhoto
        startDate
        endDate
        privacy
      }
    }
  `,
  UPDATE_EVENT: gql`
    mutation UpdateEvent($input: UpdateEventInput!) {
      updateEvent(input: $input) {
        id
        title
        description
        startDate
        endDate
        coverPhoto
        responses {
          response
          user {
            firstName
            lastName
            id
            location
            isFriend
            profilePhoto
          }
        }
        eventPhotos {
          id
          url
          user {
            id
            firstName
            lastName
          }
        }
      }
    }
  `,
  SIGN_UP_USER: gql`
    mutation SignUpUser($input: SignUpUserInput!) {
      signUpUser(input: $input) {
        phoneNumber
        firstName
        lastName
        email
      }
    }
  `,

  UPDATE_USER_ATTRIBUTES: gql`
    mutation UpdateUserAttributes($input: EditUserInput!) {
      updateUserAttributes(input: $input) {
        id
        firstName
        lastName
        email
        location
        phoneNumber
        profilePhoto
        friends {
          friend {
            id
            firstName
            lastName
          }
        }
      }
    }
  `,
  UPDATE_USER_ATTENDANCE: gql`
    mutation UpdateUserAttendance($input: UpdateUserAttendanceInput!) {
      updateUserAttendance(input: $input) {
        id
        response
      }
    }
  `,
};
