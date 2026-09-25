import React, {
  useCallback,
  useState,
} from "react";

import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  getDevices,
} from "../../api/deviceApi";

import {
  Device,
} from "../../types/device";

import DeviceCard from
  "../../components/DeviceCard";

import EmptyState from
  "../../components/EmptyState";

import {
  theme,
} from "../../theme/theme";

export default function DevicesScreen({
  navigation,
}: any) {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const loadDevices =
    async () => {
      try {
        const data =
          await getDevices();

        setDevices(data);
      } catch (error) {
        console.error(error);
      }
    };

  useFocusEffect(
    useCallback(() => {
      loadDevices();
    }, [])
  );

  const refresh =
    async () => {
      setRefreshing(true);
      await loadDevices();
      setRefreshing(false);
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Devices
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate(
              "AddDevice"
            )
          }
        >
          <Text style={styles.addText}>
            + Add
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
        keyExtractor={item =>
          item.deviceId
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onPress={() =>
              navigation.navigate(
                "DeviceDetails",
                {
                  deviceId:
                    item.deviceId,
                }
              )
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            message="No devices added yet."
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

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
    },

    addButton: {
      backgroundColor:
        theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
    },

    addText: {
      color: "#fff",
      fontWeight: "700",
    },
  });