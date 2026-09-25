import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Device,
} from "../types/device";

import {
  theme,
} from "../theme/theme";

interface Props {
  device: Device;
  onPress: () => void;
}

export default function DeviceCard({
  device,
  onPress,
}: Props) {
  const isOnline =
    device.status === "online";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>
            {device.type === "camera"
              ? "📷"
              : "●"}
          </Text>
        </View>

        <View>
          <Text style={styles.name}>
            {device.name}
          </Text>

          <Text style={styles.location}>
            {device.location ||
              "Location not set"}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor:
                isOnline
                  ? theme.colors.online
                  : theme.colors.offline,
            },
          ]}
        />

        <Text style={styles.status}>
          {device.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        theme.colors.surface,
      borderRadius:
        theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom:
        theme.spacing.sm,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 2,
    },

    left: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    icon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        "#EFF6FF",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    iconText: {
      fontSize: 20,
    },

    name: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.colors.text,
    },

    location: {
      marginTop: 4,
      color:
        theme.colors.textSecondary,
    },

    right: {
      alignItems: "center",
    },

    dot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      marginBottom: 4,
    },

    status: {
      fontSize: 11,
      textTransform: "capitalize",
      color:
        theme.colors.textSecondary,
    },
  });