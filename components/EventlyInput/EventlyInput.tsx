import { Input, InputProps } from "@rneui/base";
import React, { ReactElement } from "react";
import { View, Text, StyleSheet } from "react-native";
import EventlyText from "../EventlyText/EventlyText";
import Icon from "react-native-vector-icons/MaterialIcons";

interface EventlyInputProps extends InputProps {
  icon: { name: string; family?: string };
  contained?: boolean;
  isPassword?: boolean;
  rightIcon?: ReactElement;
}
const EventlyInput = ({
  value,
  onChangeText,
  style,
  label,
  icon,
  contained = true,
  isPassword,
  rightIcon,
  multiline,
  numberOfLines,
  ...props
}: EventlyInputProps) => {
  console.log(icon, "icon");
  const iconForInput = <Icon style={styles.icon} name={icon.name} />;
  return (
    <View style={style}>
      <Input
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={isPassword}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        inputStyle={
          contained && {
            height: multiline ? 100 : 54,
            paddingLeft: 10,
            padding: multiline ? 10 : undefined,
            marginTop: 5,
            borderWidth: 0.5,
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: 15,
          }
        }
        style={{ color: "#FFFFFF" }}
        rightIcon={rightIcon}
        label={
          <>
            <EventlyText>
              {iconForInput} {label}
            </EventlyText>
          </>
        }
        labelStyle={{ color: "#FFFFFF", marginLeft: 10 }}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: { color: "#F5F5F5", fontSize: 17, marginTop: 20 },
  rightIcon: {
    fontSize: 100,
    color: "#FFF",
    opacity: 0.5,
    position: "absolute",
    right: 15,
    top: "25%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 55,
    marginBottom: 50,
  },
  selectors: {
    flexDirection: "row",
    marginLeft: 10,
  },
  isSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
    paddingBottom: 4,
  },
});

export { EventlyInput };
