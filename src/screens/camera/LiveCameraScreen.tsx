import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getCameraStream,
} from "../../api/deviceApi";

import PTZControls from
  "./PTZControls";

import {
  StreamInfo,
} from "../../types/device";

import {
  theme,
} from "../../theme/theme";

export default function LiveCameraScreen({
  route,
}: any) {
  const {
    deviceId,
    openPTZ,
  } = route.params;

  const [stream, setStream] =
    useState<StreamInfo | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadStream();
  }, []);

  const loadStream =
    async () => {
      try {
        const data =
          await getCameraStream(
            deviceId
          );

        setStream(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to connect to camera."
        );
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
        />

        <Text>
          Connecting to camera...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.video}>
        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : (
          <>
            <Text style={styles.live}>
              ● LIVE
            </Text>

            <Text style={styles.cameraText}>
              Camera
            </Text>

            <Text style={styles.streamText}>
              {stream?.streamPath ||
                stream?.streamUrl ||
                "Waiting for WebRTC stream"}
            </Text>
          </>
        )}
      </View>

      <PTZControls
        deviceId={deviceId}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },

    video: {
      height: 280,
      backgroundColor: "#111827",
      justifyContent: "center",
      alignItems: "center",
    },

    live: {
      color: "#EF4444",
      fontWeight: "900",
      marginBottom: 15,
    },

    cameraText: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "800",
    },

    streamText: {
      color: "#94A3B8",
      marginTop: 10,
      paddingHorizontal: 20,
      textAlign: "center",
    },

    error: {
      color: "#FCA5A5",
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });