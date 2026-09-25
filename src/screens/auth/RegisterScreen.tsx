import React, {
  useState,
} from "react";

import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  theme,
} from "../../theme/theme";

export default function RegisterScreen({
  navigation,
}: any) {
  const {
    register,
  } = useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async () => {
      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        Alert.alert(
          "Required",
          "Please fill all fields."
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert(
          "Password",
          "Passwords do not match."
        );
        return;
      }

      try {
        setLoading(true);

        await register(
          name.trim(),
          email.trim(),
          password
        );
      } catch (error: any) {
        Alert.alert(
          "Registration failed",
          error.response?.data
            ?.message ||
            "Unable to register."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          Create Account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={
            setConfirmPassword
          }
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <Text style={styles.buttonText}>
              CREATE ACCOUNT
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={styles.back}>
            Already have an account?
            {" "}
            <Text style={styles.link}>
              Login
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
    },

    content: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 24,
      textAlign: "center",
    },

    input: {
      height: 52,
      borderWidth: 1,
      borderColor:
        theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: 16,
      marginBottom: 14,
      backgroundColor: "#fff",
    },

    button: {
      height: 52,
      backgroundColor:
        theme.colors.primary,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonText: {
      color: "#fff",
      fontWeight: "800",
    },

    back: {
      textAlign: "center",
      marginTop: 24,
      color:
        theme.colors.textSecondary,
    },

    link: {
      color:
        theme.colors.primary,
      fontWeight: "700",
    },
  });