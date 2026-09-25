import React, {
  useCallback,
  useState,
} from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  getDevices,
} from "../../api/deviceApi";

import {
  getAlerts,
} from "../../api/alertApi";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  Device,
} from "../../types/device";

import {
  Alert,
} from "../../types/alert";

import {
  theme,
} from "../../theme/theme";

export default function DashboardScreen() {
  const { user } =
    useAuth();

  const [devices, setDevices] =
    useState<Device[]>([]);

  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const loadData =
    async () => {
      try {
        const [
          deviceData,
          alertData,
        ] = await Promise.all([
          getDevices(),
          getAlerts(),
        ]);

        setDevices(deviceData);
        setAlerts(alertData);
      } catch (error) {
        console.error(error);
      }
    };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const refresh =
    async () => {
      setRefreshing(true);

      await loadData();

      setRefreshing(false);
    };

  const onlineCount =
    devices.filter(
      device =>
        device.status ===
        "online"
    ).length;

  const unreadAlerts =
    alerts.filter(
      alert => !alert.isRead
    ).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }
    >
      <Text style={styles.title}>
        Hello, {user?.name}
      </Text>

      <Text style={styles.subtitle}>
        Security overview
      </Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.number}>
            {devices.length}
          </Text>

          <Text style={styles.label}>
            Devices
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>
            {onlineCount}
          </Text>

          <Text style={styles.label}>
            Online
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>
            {unreadAlerts}
          </Text>

          <Text style={styles.label}>
            Alerts
          </Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          System Status
        </Text>

        <Text style={styles.active}>
          ● Monitoring Active
        </Text>
      </View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
      padding: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.text,
    },

    subtitle: {
      marginTop: 5,
      color:
        theme.colors.textSecondary,
    },

    grid: {
      flexDirection: "row",
      marginTop: 24,
      gap: 10,
    },

    card: {
      flex: 1,
      padding: 16,
      borderRadius: 14,
      backgroundColor: "#fff",
      elevation: 2,
    },

    number: {
      fontSize: 28,
      fontWeight: "800",
    },

    label: {
      marginTop: 5,
      color:
        theme.colors.textSecondary,
    },

    statusCard: {
      marginTop: 20,
      padding: 20,
      borderRadius: 14,
      backgroundColor: "#fff",
      elevation: 2,
    },

    statusTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 10,
    },

    active: {
      color:
        theme.colors.success,
      fontWeight: "700",
    },
  });