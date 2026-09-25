import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  message: string;
}

export default function EmptyState({
  message,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      padding: 30,
      alignItems: "center",
    },

    text: {
      color: "#64748B",
      fontSize: 16,
    },
  });