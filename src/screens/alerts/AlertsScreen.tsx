import React, {
  useCallback,
  useState,
} from "react";

import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  getAlerts,
} from "../../api/alertApi";

import {
  Alert,
} from "../../types/alert";

import AlertCard from
  "../../components/AlertCard";

import EmptyState from
  "../../components/EmptyState";

import {
  theme,
} from "../../theme/theme";

export default function AlertsScreen() {
  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const loadAlerts =
    async () => {
      try {
        const data =
          await getAlerts();

        setAlerts(data);
      } catch (error) {
        console.error(error);
      }
    };

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [])
  );

  const refresh =
    async () => {
      setRefreshing(true);

      await loadAlerts();

      setRefreshing(false);
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Security Alerts
      </Text>

      <FlatList
        data={alerts}
        keyExtractor={item =>
          item._id
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        renderItem={({ item }) => (
          <AlertCard
            alert={item}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            message="No security alerts."
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
  });