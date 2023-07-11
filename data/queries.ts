import gql from "graphql-tag";

export const queries = {
  GET_EVENTS_BY_USER_ID: gql`
    query GetEventsByUserId($iduser: String!) {
      eventsByUserId(iduser: $iduser) {
        id
        title
        description
        user {
          id
          firstName
          lastName
        }
        category
        location
        coverPhoto
        startDate
        endDate
        privacy
        length
        comments {
          id
          content
          user {
            firstName
            lastName
          }
          createdOn
        }
        responses {
          event {
            id
          }
          eventId
          user {
            id
          }
          userId
          response
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
  GET_USER_BY_PHONE: gql`
    query GetUserByPhone($phoneNumber: String!) {
      userByPhone(phoneNumber: $phoneNumber) {
        id
        firstName
        lastName
        email
        phoneNumber
        friends {
          id
          firstName
          lastName
        }
        events {
          id
        }
      }
    }
  `,
  GET_USER_BY_EMAIl: gql`
    query GetUserByEmail($email: String!) {
      userByEmail(email: $email) {
        id
        firstName
        lastName
        location
        email
        profilePhoto
        bio
        phoneNumber
        friends {
          friend {
            id
            firstName
            lastName
            location
            profilePhoto
          }
        }
        events {
          id
        }
      }
    }
  `,
  GET_ACTIVE_USER: gql`
    query ActiveUser {
      activeUser @client {
        id
        email
        location
        phoneNumber
        firstName
        lastName
        profilePhoto
        bio
        friends {
          friend {
            id
            firstName
            lastName
            location
            profilePhoto
          }
        }
        events {
          id
        }
      }
    }
  `,
  GET_EVENT_BY_ID: gql`
    query GetEventById($input: EventByIdInput!) {
      eventById(input: $input) {
        id
        category
        title
        description
        startDate
        location
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
};
