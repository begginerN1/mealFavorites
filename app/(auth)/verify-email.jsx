import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

const VerifyEmail = ({ email, onBack }) => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Verification failed, please try again");
        console.log(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Verification failed");
      console.log(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
            {/* Title */}
            <Text style={authStyles.title}>Verify your email</Text>
            <Text style={authStyles.subtitle}>
              We have sent a Verification code to your {email}
            </Text>
          </View>
          {/* --------------------------- FORM CONTAINER --------------------- */}
          <View style={authStyles.formContainer}>
            {/* --------------------------- EMAIL CONTAINER --------------------- */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code..."
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleVerification}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Verifying..." : "Verify Email!"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
            <Text style={authStyles.linkText}>
              Back to
              <Text style={authStyles.link}> Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
