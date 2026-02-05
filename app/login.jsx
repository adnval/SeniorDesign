import React from "react";
import { StatusBar } from "expo-status-bar";
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

import ScreenWrapper from "components/ScreenWrapper";
import BackButton from "components/BackButton";

import { 
  FormControl, 
  FormControlLabel, 
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";

import { Pressable, View, Alert } from "react-native";
import { styles } from "@/constants/theme";

import { supabase } from "@/lib/supabase";




const Login = () => {
  const router = useRouter();
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const handleLogin = async () => {
    if (passwordInput?.length < 6 || !emailInput) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      let email = emailInput.trim();
      let password = passwordInput.trim();
      const {error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      console.log('error', error);
      if (error) {
        Alert.alert('Error signing in:', error.message);
      } else {
        setEmailInput('');
        setPasswordInput('');
      }
    }
  };

  return (
      <Center className="flex-1 p-6">
        <VStack className="rounded-xl border border-outline-200 bg-background-0 p-6 w-full max-w-[336px]">
          <Heading>Welcome Back!</Heading>
          <Text className="mt-2">Login to start using Locale</Text>
          <FormControl className="w-full mt-4">
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Enter your email"
                value={emailInput}
                //@ts-ignore
                // onChange={(e) => setEmailInput(e.target.value)}
                onChangeText={setEmailInput}
              />
            </Input>
          </FormControl>
          <FormControl isInvalid={isInvalid} className="mt-6 w-full">
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={passwordInput}
                //@ts-ignore
                // onChange={(e) => setPasswordInput(e.target.value)}
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

          <HStack className="justify-between my-5">
            <Checkbox value={''} size="sm">
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel>Remember me</CheckboxLabel>
            </Checkbox>

            <Button variant="link" size="sm">
              <ButtonText className="underline underline-offset-1">
                Forgot Password?
              </ButtonText>
            </Button>
          </HStack>
          <Button className="w-full" size="sm" onPress={handleLogin}>
            <ButtonText>Log in</ButtonText>
          </Button>
        </VStack>
        <View style={styles.bottomTextContainer}>
            <Text style={styles.secondaryText}>Don't have an account?</Text>
            <Pressable onPress={() => router.push('/SignUp')}>
                <Text style={styles.primaryText}>Sign Up</Text>
            </Pressable>
        </View>
      </Center>
  );
};

export default Login;
