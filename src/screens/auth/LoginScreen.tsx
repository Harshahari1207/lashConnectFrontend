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

export default function LoginScreen({
  navigation,
}: any) {
  const {
    login,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {
      if (!email || !password) {
        Alert.alert(
          "Required",
          "Please enter email and password."
        );
        return;
      }

      try {
        setLoading(true);

        await login(
          email.trim(),
          password
        );
      } catch (error: any) {
        Alert.alert(
          "Login failed",
          error.response?.data
            ?.message ||
            "Unable to login."
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
        <Text style={styles.logo}>
          LASH CONNECT
        </Text>

        <Text style={styles.subtitle}>
          Cloud-Based IoT Surveillance
        </Text>

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

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <Text style={styles.buttonText}>
              LOGIN
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "Register"
            )
          }
        >
          <Text style={styles.register}>
            Don't have an account?
            {" "}
            <Text style={styles.link}>
              Register
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

    logo: {
      fontSize: 30,
      fontWeight: "900",
      color:
        theme.colors.primary,
      textAlign: "center",
    },

    subtitle: {
      textAlign: "center",
      color:
        theme.colors.textSecondary,
      marginTop: 8,
      marginBottom: 32,
    },

    input: {
      height: 52,
      borderWidth: 1,
      borderColor:
        theme.colors.border,
      borderRadius:
        theme.radius.md,
      paddingHorizontal: 16,
      marginBottom: 14,
      backgroundColor: "#fff",
    },

    button: {
      height: 52,
      backgroundColor:
        theme.colors.primary,
      borderRadius:
        theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 6,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "800",
    },

    register: {
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