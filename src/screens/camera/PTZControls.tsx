import React, {
  useState,
} from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import apiClient from
  "../../api/apiClient";

import {
  PTZ_ACTIONS,
} from "../../utils/constants";

interface Props {
  deviceId: string;
}

export default function PTZControls({
  deviceId,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const sendPTZ =
    async (
      action: string
    ) => {
      try {
        setLoading(true);

        await apiClient.post(
          `/cameras/${deviceId}/ptz`,
          {
            action,
          }
        );
      } catch (error: any) {
        Alert.alert(
          "PTZ Error",
          error.response?.data
            ?.message ||
            "Unable to send PTZ command."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Camera Control
      </Text>

      <TouchableOpacity
        style={styles.control}
        disabled={loading}
        onPress={() =>
          sendPTZ(
            PTZ_ACTIONS.UP
          )
        }
      >
        <Text style={styles.text}>
          ▲
        </Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.control}
          disabled={loading}
          onPress={() =>
            sendPTZ(
              PTZ_ACTIONS.LEFT
            )
          }
        >
          <Text style={styles.text}>
            ◀
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.control,
            styles.stop,
          ]}
          disabled={loading}
          onPress={() =>
            sendPTZ(
              PTZ_ACTIONS.STOP
            )
          }
        >
          <Text style={styles.text}>
            ■
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.control}
          disabled={loading}
          onPress={() =>
            sendPTZ(
              PTZ_ACTIONS.RIGHT
            )
          }
        >
          <Text style={styles.text}>
            ▶
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.control}
        disabled={loading}
        onPress={() =>
          sendPTZ(
            PTZ_ACTIONS.DOWN
          )
        }
      >
        <Text style={styles.text}>
          ▼
        </Text>
      </TouchableOpacity>

      <View style={styles.zoomRow}>
        <TouchableOpacity
          style={styles.zoom}
          onPress={() =>
            sendPTZ(
              PTZ_ACTIONS.ZOOM_IN
            )
          }
        >
          <Text>
            Zoom +
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.zoom}
          onPress={() =>
            sendPTZ(
              PTZ_ACTIONS.ZOOM_OUT
            )
          }
        >
          <Text>
            Zoom -
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      alignItems: "center",
      padding: 20,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 16,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
    },

    control: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: "#E2E8F0",
      alignItems: "center",
      justifyContent: "center",
      margin: 5,
    },

    stop: {
      backgroundColor: "#FECACA",
    },

    text: {
      fontSize: 22,
      fontWeight: "800",
    },

    zoomRow: {
      flexDirection: "row",
      marginTop: 12,
    },

    zoom: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: "#E2E8F0",
      marginHorizontal: 5,
    },
  });