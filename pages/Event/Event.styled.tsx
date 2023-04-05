import { Button, Icon } from "@rneui/base";
import styled from "styled-components/native";
import { EventlyInput } from "../../components/EventlyComponents";
import { StyleSheet } from "react-native";

export const BackIcon = styled(Icon)``;

export const ProfileInput = styled(EventlyInput)`
  margin-top: 20;
`;

export const InviteButton = styled(Button)`
  background-color: "#FFFFFF";
  border-radius: 16px;
  height: 54px;
  margin: 40px 33px;
`;

export const createEventStyles = StyleSheet.create({
  inviteButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    height: 54,
    marginVertical: 40,
    marginHorizontal: 33,
  },
  inviteButtonTitle: {
    color: "#000000",
    fontWeight: "500",
  },
  backIcon: {
    position: "absolute",
    left: "10%",
    top: "5%",
    borderWidth: 1,
    zIndex: 1000,
    borderColor: "rgba(255, 255, 255, 0.4",
  },
});
