import { TextProps } from "@rneui/base";
import { Text } from "react-native-elements";
import React from "react";
import { useFonts } from "expo-font";

interface EventlyTextProps extends TextProps {
  text?: string;
  style?: any;
  fontFamily?: fontFamilies;
}

export type fontFamilies =
  | "promptMedium"
  | "promptSemiBold"
  | "cabinCondensedMedium";

const EventlyText = ({
  text,
  children,
  style,
  fontFamily = "promptMedium",
  ...props
}: EventlyTextProps) => {
  const [loaded] = useFonts({
    promptMedium: require("../../assets/fonts/prompt/Prompt-Medium.ttf"),
    promptSemiBold: require("../../assets/fonts/prompt/Prompt-SemiBold.ttf"),
    cabinCondensedMedium: require("../../assets/fonts/cabinCondensed/CabinCondensed-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <Text
      {...props}
      style={{
        color: "#FFFFFF",
        ...style,
        fontFamily: fontFamily ? fontFamily : "promptMedium",
      }}
    >
      {children}
    </Text>
  );
};

export default EventlyText;
