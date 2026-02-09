import React from "react";
import { useRouter } from "expo-router";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, CheckIcon } from "@/components/ui/icon";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Alert, Pressable, View } from "react-native";
import { styles } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";

const SignUp = () => {
  const router = useRouter();

  const [nameInput, setNameInput] = React.useState("");
  const [emailInput, setEmailInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isInvalid, setIsInvalid] = React.useState(false);

  const handleSignUp = async () => {
    if (passwordInput.length < 6) {
      setIsInvalid(true);
      return;
    }
    if (!emailInput || !nameInput || !passwordInput) {
      setIsInvalid(true);
      return;
    }

    let name = nameInput.trim();
    let email = emailInput.trim();
    let password = passwordInput.trim();
    let username = email.split('@')[0];

    setIsInvalid(false);

    const {data: {session}, error} = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
            name,
            username
      }
    }}); 

    console.log('session', session);
    console.log('error', error);
    if (error){
        Alert.alert('Error signing up:', error.message);
    }

    // TODO: wire real signup logic here
    setNameInput("");
    setEmailInput("");
    setPasswordInput("");
  };

  return (
    <ScreenWrapper bg="white">
    <View className="w-full items-center px-6">
      <View className="w-full max-w-[336px]">
        <BackButton router={router} route={"/welcome"} />
      </View>
    </View>
    <Center className="flex-1 p-6">
      <VStack className="rounded-xl bg-background-0 p-3 w-full max-w-[336px]">
        <Heading>Create an account</Heading>
        <Text className="mt-2">Sign up to start using Locale</Text>

        {/* Name */}
        <FormControl className="w-full mt-4">
          <FormControlLabel>
            <FormControlLabelText>Name</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter your name"
              value={nameInput}
              onChangeText={setNameInput}
            />
          </Input>
        </FormControl>

        {/* Email */}
        <FormControl className="w-full mt-4">
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="text"
              placeholder="Enter your email"
              value={emailInput}
              onChangeText={setEmailInput}
            />
          </Input>
        </FormControl>

        {/* Password */}
        <FormControl isInvalid={isInvalid} className="mt-6 w-full">
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            <InputSlot
              onPress={() => setShowPassword(!showPassword)}
              className="mr-3"
            >
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>

          <FormControlHelper>
            <FormControlHelperText>
              Must be at least 6 characters.
            </FormControlHelperText>
          </FormControlHelper>

          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText size="sm">
              At least 6 characters are required.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <HStack className="justify-between my-5"/>


        <Pressable className="w-full" onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>
      </VStack>
      <View style={styles.bottomTextContainer}>
            <Text style={styles.secondaryText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.primaryText}>Sign In</Text>
            </Pressable>
        </View>
    </Center>
    </ScreenWrapper>
    
  );
};

export default SignUp;
