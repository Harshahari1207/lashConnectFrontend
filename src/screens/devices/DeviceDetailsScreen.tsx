import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  deleteDevice,
  getDevice,
} from "../../api/deviceApi";

import {
  Device,
} from "../../types/device";

import {
  theme,
} from "../../theme/theme";

export default function DeviceDetailsScreen({
  route,
  navigation,
}: any) {
  const {
    deviceId,
  } = route.params;

  const [device, setDevice] =
    useState<Device | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDevice();
  }, []);

  const loadDevice =
    async () => {
      try {
        const data =
          await getDevice(
            deviceId
          );

        setDevice(data);
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to load device."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    () => {
      Alert.alert(
        "Delete Device",
        "Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress:
              async () => {
                try {
                  await deleteDevice(
                    deviceId
                  );

                  navigation.goBack();
                } catch {
                  Alert.alert(
                    "Error",
                    "Unable to delete device."
                  );
                }
              },
          },
        ]
      );
    };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>
          Device not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
    >
      <Text style={styles.title}>
        {device.name}
      </Text>

      <View style={styles.card}>
        <Info
          label="Device ID"
          value={device.deviceId}
        />

        <Info
          label="Type"
          value={device.type}
        />

        <Info
          label="Status"
          value={device.status}
        />

        <Info
          label="Location"
          value={
            device.location ||
            "Not set"
          }
        />

        <Info
          label="Paired"
          value={
            device.paired
              ? "Yes"
              : "No"
          }
        />
      </View>

      {device.type === "camera" &&
        device.paired && (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate(
                  "LiveCamera",
                  {
                    deviceId,
                  }
                )
              }
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                LIVE CAMERA
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                navigation.navigate(
                  "LiveCamera",
                  {
                    deviceId,
                    openPTZ: true,
                  }
                )
              }
            >
              <Text>
                PTZ CONTROL
              </Text>
            </TouchableOpacity>
          </>
        )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteText}>
          DELETE DEVICE
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Info = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.info}>
    <Text style={styles.label}>
      {label}
    </Text>

    <Text style={styles.value}>
      {value}
    </Text>
  </View>
);

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
      padding: 20,
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 20,
    },

    card: {
      backgroundColor: "#fff",
      borderRadius: 14,
      padding: 18,
      elevation: 2,
    },

    info: {
      marginBottom: 16,
    },

    label: {
      color:
        theme.colors.textSecondary,
      fontSize: 12,
    },

    value: {
      fontSize: 16,
      marginTop: 4,
      fontWeight: "600",
    },

    primaryButton: {
      marginTop: 20,
      height: 52,
      borderRadius: 10,
      backgroundColor:
        theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },

    secondaryButton: {
      marginTop: 10,
      height: 52,
      borderRadius: 10,
      borderWidth: 1,
      borderColor:
        theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonText: {
      color: "#fff",
      fontWeight: "800",
    },

    deleteButton: {
      marginTop: 30,
      marginBottom: 30,
      height: 50,
      borderRadius: 10,
      borderWidth: 1,
      borderColor:
        theme.colors.danger,
      justifyContent: "center",
      alignItems: "center",
    },

    deleteText: {
      color:
        theme.colors.danger,
      fontWeight: "800",
    },
  });