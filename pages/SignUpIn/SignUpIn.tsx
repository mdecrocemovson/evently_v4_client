import { Button, Icon, Tab, TabView, Text } from "@rneui/base";
import { Divider } from "@rneui/themed";

import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { EventlyInput } from "/Users/michaeldecroce-movson/Desktop/evently_v4_client/components/EventlyInput/EventlyInput";
import EventlyText from "../../components/EventlyText/EventlyText";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../container/Portal";

import { mutations } from "../../data/mutations";
import { queries } from "../../data/queries";

import { useApolloClient, useMutation, useLazyQuery } from "@apollo/client";
import { styles } from "./SignUpIn.styles";
import { helpers } from "../../data/helpers";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

type Props = NativeStackScreenProps<RootStackParamList, "SignUpIn">;

const SignUpIn = ({ navigation }: Props) => {
  const [firebaseUser, firebaseLoading, error] = useAuthState(auth);

  const client = useApolloClient();
  const activeUser = helpers.useGetActiveUser();

  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const useSignUpUser = () =>
    useMutation(mutations.SIGN_UP_USER, {
      onCompleted: () => console.log("User"),
      onError: (err) => console.log(err),
    });

  const [signUpUser, signUpUserStatus] = useSignUpUser();

  const setActiveUser = helpers.useSetActiveUser(
    client,
    true,
    // TODO - fix types
    navigation as any
  );

  // const [getUser, { loading, data }] = useLazyQuery<GetUserByPhoneQuery>(
  //   queries.GET_USER_BY_PHONE
  // );
  const [getUserByEmail, { loading, data }] = useLazyQuery(
    queries.GET_USER_BY_EMAIl
  );

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await getUserByEmail({
        variables: {
          email,
        },
      });
    } catch (err) {
      console.log(err, "err");
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      setActiveUser({
        variables: {
          email: firebaseUser.email,
        },
      });
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (data && data.userByEmail) {
      setActiveUser({
        variables: { email: data.userByEmail.email },
      });
      navigation.navigate("CreateEvent");
    }
  }, [data]);

  const signUp = async () => {
    try {
      const userDetails = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await signUpUser({
        variables: {
          input: {
            phoneNumber,
            email,
            firstName,
            lastName,
            bio: "I like the booze",
          },
        },
      });
      await setActiveUser({
        variables: { email },
      });
      navigation.navigate("CreateEvent");
    } catch (err) {
      console.log(err, "err");
    }
  };

  const setInputState =
    (setStateFunc: { (value: React.SetStateAction<string>): void }) =>
    (text: string) =>
      setStateFunc(text);

  const signupInputs = [
    {
      label: "First Name",
      onChangeText: setInputState(setFirstName),
    },
    {
      label: "Last Name",
      onChangeText: setInputState(setLastName),
    },
    {
      label: "Phone Number",
      onChangeText: setInputState(setPhoneNumber),
    },
    {
      label: "Email",
      onChangeText: setInputState(setEmail),
    },
  ];

  const loginInputs = [
    {
      label: "Email",
      onChangeText: setInputState(setEmail),
    },
  ];

  return (
    <ScrollView style={styles.app}>
      <View style={styles.header}>
        <EventlyText fontFamily="promptSemiBold" style={{ fontSize: 40 }}>
          Evently
        </EventlyText>
      </View>
      <View style={styles.selectors}>
        <TouchableOpacity
          onPress={(e) => setIsSignup(false)}
          style={!isSignup ? styles.isSelected : {}}
        >
          <EventlyText fontFamily="promptSemiBold">Log In</EventlyText>
        </TouchableOpacity>
        <View style={{ width: 40 }} />
        <TouchableOpacity
          onPress={(e) => setIsSignup(true)}
          style={isSignup ? styles.isSelected : {}}
        >
          <EventlyText fontFamily="promptSemiBold">Sign Up</EventlyText>
        </TouchableOpacity>
      </View>
      <Divider style={{ marginTop: 4 }} />

      {isSignup &&
        signupInputs.map((input) => {
          return (
            <EventlyInput
              key={input.label}
              label={input.label}
              icon={{ name: "account-circle" }}
              onChangeText={input.onChangeText}
              contained
            />
          );
        })}
      {!isSignup &&
        loginInputs.map((input) => {
          return (
            <EventlyInput
              key={input.label}
              label={input.label}
              icon={{ name: "account-circle" }}
              onChangeText={input.onChangeText}
              contained
            />
          );
        })}

      <EventlyInput
        isPassword={showPassword}
        label="Password"
        icon={{ name: "account-circle" }}
        onChangeText={(e) => setPassword(e)}
        contained
        rightIcon={
          <Icon
            onPress={(e) => setShowPassword(!showPassword)}
            iconStyle={{ color: "#FFF" }}
            containerStyle={styles.rightIcon}
            name={showPassword ? "visibility" : "visibility-off"}
          />
        }
      />

      <Button
        buttonStyle={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          height: 54,
          marginVertical: 40,
          marginHorizontal: 33,
        }}
        onPress={() => (isSignup ? signUp() : login())}
        titleStyle={{ color: "#000000", fontWeight: "500" }}
        title={isSignup ? "Sign Up" : "Log In"}
      />
    </ScrollView>
  );
};

export default SignUpIn;
