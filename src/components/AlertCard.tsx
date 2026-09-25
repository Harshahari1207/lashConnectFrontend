import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Alert,
} from "../types/alert";

import {
  theme,
} from "../theme/theme";

interface Props {
  alert: Alert;
}

export default function AlertCard({
  alert,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        !alert.isRead &&
          styles.unread,
      ]}
    >
      <View style={styles.icon}>
        <Text>
          {alert.type === "motion"
            ? "⚠️"
            : "🔔"}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {alert.title}
        </Text>

        <Text style={styles.message}>
          {alert.message}
        </Text>

        <Text style={styles.date}>
          {new Date(
            alert.createdAt
          ).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      flexDirection: "row",
      padding: 16,
      marginBottom: 10,
      borderRadius: 12,
      backgroundColor:
        theme.colors.surface,
      elevation: 2,
    },

    unread: {
      borderLeftWidth: 4,
      borderLeftColor:
        theme.colors.warning,
    },

    icon: {
      width: 42,
      alignItems: "center",
    },

    content: {
      flex: 1,
    },

    title: {
      fontWeight: "700",
      fontSize: 16,
    },

    message: {
      marginTop: 5,
      color:
        theme.colors.textSecondary,
    },

    date: {
      marginTop: 8,
      fontSize: 11,
      color:
        theme.colors.textSecondary,
    },
  });