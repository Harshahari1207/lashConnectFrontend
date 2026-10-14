
import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import Video from "react-native-video";

import { getRecordings } from "../../api/recordingApi";
import { getToken } from "../../services/storageService";
import { API_URL } from "../../utils/constants";

import type { Recording } from "../../types/recording";

import EmptyState from "../../components/EmptyState";
import { theme } from "../../theme/theme";

type VideoSource = {
  uri: string;
  headers: {
    Authorization: string;
  };
};

export default function RecordingsScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedRecording, setSelectedRecording] =
    useState<Recording | null>(null);

  const [videoSource, setVideoSource] =
    useState<VideoSource | null>(null);

  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");

  const loadRecordings = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getRecordings();

      setRecordings(data);
    } catch (error) {
      console.error("Failed to load recordings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRecordings();
    }, [loadRecordings]),
  );

  const handlePlayRecording = async (recording: Recording) => {
    try {
      setVideoLoading(true);
      setVideoError("");

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please sign in again to watch recordings.",
        );
        return;
      }

      const videoUrl =
        `${API_URL}/recordings/${recording._id}/video`;

      setVideoSource({
        uri: videoUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedRecording(recording);
    } catch (error) {
      console.error("Unable to open recording:", error);

      Alert.alert(
        "Playback Error",
        "Unable to open this recording.",
      );
    } finally {
      setVideoLoading(false);
    }
  };

  const closePlayer = () => {
    setSelectedRecording(null);
    setVideoSource(null);
    setVideoError("");
  };

  const formatDuration = (seconds?: number) => {
    if (seconds === undefined || seconds === null) {
      return "Unknown";
    }

    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining,
    ).padStart(2, "0")}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null) {
      return "Unknown";
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const renderRecording = ({ item }: { item: Recording }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.recordingTitle}>
          Camera Recording
        </Text>

        <Text style={styles.completedBadge}>
          ● Saved
        </Text>
      </View>

      <Text style={styles.device}>
        Device: {String(item.deviceId)}
      </Text>

      <Text style={styles.detail}>
        Start: {new Date(item.startTime).toLocaleString()}
      </Text>

      <Text style={styles.detail}>
        End:{" "}
        {item.endTime
          ? new Date(item.endTime).toLocaleString()
          : "Not available"}
      </Text>

      <Text style={styles.detail}>
        Duration: {formatDuration(item.durationSeconds)}
      </Text>

      <Text style={styles.detail}>
        Size: {formatFileSize(item.sizeBytes)}
      </Text>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => void handlePlayRecording(item)}
        disabled={videoLoading}
      >
        <Text style={styles.playButtonText}>
          ▶ Watch Video
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recordings</Text>

      {loading && recordings.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>
            Loading recordings...
          </Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          keyExtractor={(item) => item._id}
          renderItem={renderRecording}
          refreshing={loading}
          onRefresh={() => void loadRecordings()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState message="No recordings available." />
          }
        />
      )}

      <Modal
        visible={selectedRecording !== null}
        animationType="slide"
        onRequestClose={closePlayer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Recording Playback
            </Text>

            <Pressable
              onPress={closePlayer}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>
                ✕ Close
              </Text>
            </Pressable>
          </View>

          {videoSource && (
            <Video
              key={videoSource.uri}
              source={videoSource}
              style={styles.videoPlayer}
              controls
              resizeMode="contain"
              paused={false}
              onLoad={() => {
                console.log("Recording video loaded");
              }}
              onError={(error) => {
                console.error(
                  "Recording playback error:",
                  JSON.stringify(error, null, 2),
                );

                setVideoError(
                  "Unable to play this recording.",
                );
              }}
            />
          )}

          {videoError !== "" && (
            <Text style={styles.videoError}>
              {videoError}
            </Text>
          )}

          {selectedRecording && (
            <View style={styles.videoInfo}>
              <Text style={styles.videoInfoTitle}>
                Camera Recording
              </Text>

              <Text style={styles.videoInfoText}>
                Recorded:{" "}
                {new Date(
                  selectedRecording.startTime,
                ).toLocaleString()}
              </Text>

              <Text style={styles.videoInfoText}>
                Duration:{" "}
                {formatDuration(
                  selectedRecording.durationSeconds,
                )}
              </Text>

              <Text style={styles.videoInfoText}>
                Size:{" "}
                {formatFileSize(
                  selectedRecording.sizeBytes,
                )}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
    color: "#111827",
  },

  listContent: {
    paddingBottom: 24,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  recordingTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  completedBadge: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },

  device: {
    fontWeight: "700",
    marginBottom: 8,
    color: "#374151",
  },

  detail: {
    color: "#4B5563",
    marginBottom: 4,
    fontSize: 13,
  },

  playButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 14,
  },

  playButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },

  modalHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  closeButton: {
    padding: 8,
  },

  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  videoPlayer: {
    width: "100%",
    height: 260,
    backgroundColor: "#000000",
  },

  videoError: {
    color: "#FCA5A5",
    textAlign: "center",
    padding: 16,
  },

  videoInfo: {
    padding: 20,
  },

  videoInfoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  videoInfoText: {
    color: "#D1D5DB",
    fontSize: 14,
    marginBottom: 8,
  },
});
