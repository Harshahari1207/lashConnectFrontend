import React, {
  useCallback,
  useState,
} from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  getRecordings,
} from "../../api/recordingApi";

import {
  Recording,
} from "../../types/recording";

import EmptyState from
  "../../components/EmptyState";

import {
  theme,
} from "../../theme/theme";

export default function RecordingsScreen() {
  const [recordings, setRecordings] =
    useState<Recording[]>([]);

  const loadRecordings =
    async () => {
      try {
        const data =
          await getRecordings();

        setRecordings(data);
      } catch (error) {
        console.error(error);
      }
    };

  useFocusEffect(
    useCallback(() => {
      loadRecordings();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Recordings
      </Text>

      <FlatList
        data={recordings}
        keyExtractor={item =>
          item._id
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.device}>
              Device:{" "}
              {item.deviceId}
            </Text>

            <Text>
              Start:{" "}
              {new Date(
                item.startTime
              ).toLocaleString()}
            </Text>

            <Text>
              End:{" "}
              {new Date(
                item.endTime
              ).toLocaleString()}
            </Text>

            {item.duration !==
              undefined && (
              <Text>
                Duration:{" "}
                {item.duration}s
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            message="No recordings available."
          />
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor:
        theme.colors.background,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 16,
    },

    card: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 12,
      marginBottom: 10,
      elevation: 2,
    },

    device: {
      fontWeight: "700",
      marginBottom: 8,
    },
  });