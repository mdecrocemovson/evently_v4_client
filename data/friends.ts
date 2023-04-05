import jessie from "../assets/JessieJackson.png";
import michael from "../assets/MichaelGreen.png";
import john from "../assets/JohnDoe.png";
import { TFriend } from "../pages/CreateEvent/CreateEvent";

export const friends: TFriend[] = [
  {
    location: "Austin, TX",
    firstName: "Jessie",
    lastName: "Jackson",
    profilePhoto: jessie,
    id: 1,
    eventAttended: "Barstool chase",
    isFriend: true,
  },
  {
    location: "Brooklyn, NY",
    id: 2,
    firstName: "Michael",
    lastName: "Green",
    eventAttended: "Barstool chase",
    profilePhoto: michael,
    isFriend: true,
  },
  {
    location: "Boston, MA",
    id: 3,
    firstName: "Michael",
    lastName: "Green",
    eventAttended: "Choking on a piece of gum",
    profilePhoto: john,
    isFriend: false,
  },
  {
    location: "Boston, MA",
    id: 4,
    firstName: "Michael",
    lastName: "Green",
    eventAttended: "Choking on a piece of gum",
    profilePhoto: john,
    isFriend: false,
  },
  {
    location: "Boston, MA",
    id: 5,
    firstName: "Michael",
    lastName: "Green",
    eventAttended: "Choking on a piece of gum",
    profilePhoto: john,
    isFriend: false,
  },
];
