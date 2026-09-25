import React, {
  useState,
} from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createDevice,
} from "../../api/deviceApi";

import {
  theme,
} from "../../theme/theme";

export default function AddDeviceScreen({
  navigation,
}: any) {
  const [deviceId, setDeviceId] =
    useState("");

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleAdd =
    async () => {
      if (!deviceId || !name) {
        Alert.alert(
          "Required",
          "Device ID and name are required."
        );

        return;
      }

      try {
        setLoading(true);

        await createDevice({
          deviceId:
            deviceId.trim(),
          name: name.trim(),
          type: "camera",
          location:
            location.trim(),
        });

        Alert.alert(
          "Success",
          "Device added successfully.",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.goBack(),
            },
          ]
        );
      } catch (error: any) {
        Alert.alert(
          "Failed",
          error.response?.data
            ?.message ||
            "Unable to add device."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Add Camera
      </Text>

      <Text style={styles.description}>
        Enter the device information.
        QR onboarding can be connected
        here for physical cameras.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Device ID"
        value={deviceId}
        onChangeText={setDeviceId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Camera name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Adding..."
            : "ADD DEVICE"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor:
        theme.colors.background,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 10,
    },

    description: {
      color:
        theme.colors.textSecondary,
      marginBottom: 24,
      lineHeight: 20,
    },

    input: {
      height: 52,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor:
        theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: 16,
      marginBottom: 14,
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
  });