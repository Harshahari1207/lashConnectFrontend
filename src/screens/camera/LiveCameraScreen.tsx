
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Video from 'react-native-video';
import { useFocusEffect } from '@react-navigation/native';

import { getCameraStream } from '../../api/deviceApi';
import {
  startRecording,
  stopRecording,
} from '../../api/recordingApi';

import PTZControls from './PTZControls';
import type { StreamInfo } from '../../types/device';

export default function LiveCameraScreen({ route }: any) {
  const { deviceId } = route.params;

  const [stream, setStream] = useState<StreamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [videoReady, setVideoReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const recordingIdRef = useRef<string | null>(null);
  const recordingStartRef = useRef<number | null>(null);
  const sessionActiveRef = useRef(false);
  const operationInProgressRef = useRef(false);

  const stopActiveRecording = useCallback(
    async (showMessage = false) => {
      const id = recordingIdRef.current;

      if (!id || operationInProgressRef.current) {
        return;
      }

      operationInProgressRef.current = true;
      setRecordingLoading(true);

      try {
        await stopRecording(id);

        recordingIdRef.current = null;
        recordingStartRef.current = null;
        setIsRecording(false);
        setRecordingSeconds(0);

        if (showMessage && sessionActiveRef.current) {
          Alert.alert(
            'Recording Stopped',
            'Your recording is being saved. Check the Recordings tab shortly.',
          );
        }
      } catch (err) {
        console.error('Stop recording failed:', err);

        if (showMessage && sessionActiveRef.current) {
          Alert.alert(
            'Error',
            'Unable to stop recording. Please try again.',
          );
        }
      } finally {
        operationInProgressRef.current = false;

        if (sessionActiveRef.current) {
          setRecordingLoading(false);
        }
      }
    },
    [],
  );

  const handleStartRecording = async () => {
    if (
      operationInProgressRef.current ||
      recordingIdRef.current ||
      !videoReady ||
      !sessionActiveRef.current
    ) {
      return;
    }

    operationInProgressRef.current = true;
    setRecordingLoading(true);

    try {
      const recording = await startRecording(deviceId);

      recordingIdRef.current = recording._id;
      recordingStartRef.current = Date.now();

      if (sessionActiveRef.current) {
        setIsRecording(true);
        setRecordingSeconds(0);

        Alert.alert(
          'Recording Started',
          'Your camera session is now being recorded.',
        );
      }
    } catch (err) {
      console.error('Start recording failed:', err);

      if (sessionActiveRef.current) {
        Alert.alert(
          'Error',
          'Unable to start recording. Check the backend and camera stream.',
        );
      }
    } finally {
      operationInProgressRef.current = false;

      if (sessionActiveRef.current) {
        setRecordingLoading(false);
      }

      // If the user navigated away during the start request,
      // stop the recording that was just created.
      if (!sessionActiveRef.current && recordingIdRef.current) {
        void stopActiveRecording(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      sessionActiveRef.current = true;

      return () => {
        sessionActiveRef.current = false;

        // Stop recording when leaving the screen.
        void stopActiveRecording(false);
      };
    }, [stopActiveRecording]),
  );

  useEffect(() => {
    let mounted = true;

    const loadStream = async () => {
      try {
        setLoading(true);
        setError('');
        setVideoReady(false);

        const data = await getCameraStream(deviceId);

        if (mounted) {
          setStream(data);
        }
      } catch (err) {
        console.error('Failed to fetch camera stream:', err);

        if (mounted) {
          setError('Unable to connect to camera.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadStream();

    return () => {
      mounted = false;
    };
  }, [deviceId]);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const interval = setInterval(() => {
      if (recordingStartRef.current) {
        const elapsed = Math.floor(
          (Date.now() - recordingStartRef.current) / 1000,
        );

        setRecordingSeconds(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  // Simulated camera stream used during local development.
  const streamUrl = 'http://10.0.2.2:8888/camera1/index.m3u8';

  // For a real camera, use the URL supplied by the backend
  // after the streaming setup is complete.
  // const streamUrl = stream?.streamUrl || stream?.rtspUrl;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />

        <Text style={styles.loadingText}>
          Connecting to camera...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.video}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : streamUrl ? (
          <>
            <Video
              source={{
                uri: streamUrl,
                type: 'm3u8',
              }}
              style={styles.player}
              controls
              resizeMode="contain"
              paused={false}
              muted
              onLoad={() => {
                console.log('Camera stream loaded successfully.');
                setVideoReady(true);
              }}
              onError={videoError => {
                console.error(
                  'Video playback error:',
                  JSON.stringify(videoError, null, 2),
                );

                setVideoReady(false);
                setError('Unable to play the simulated camera stream.');

                void stopActiveRecording(false);
              }}
            />

            <View style={styles.liveBadge}>
              <Text style={styles.live}>● LIVE</Text>
            </View>

            {isRecording && (
              <View style={styles.recordingBadge}>
                <Text style={styles.recordingBadgeText}>
                  ● REC {formatTime(recordingSeconds)}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.cameraText}>Camera</Text>

            <Text style={styles.streamText}>
              No video stream URL was returned by the server.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.recordingControls}>
        <Text style={styles.sectionTitle}>
          Video Recording
        </Text>

        {!isRecording ? (
          <TouchableOpacity
            style={[
              styles.recordButton,
              (recordingLoading || !videoReady) &&
                styles.disabledButton,
            ]}
            disabled={recordingLoading || !videoReady}
            onPress={() => void handleStartRecording()}
          >
            {recordingLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                ● Start Recording
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.stopButton,
              recordingLoading && styles.disabledButton,
            ]}
            disabled={recordingLoading}
            onPress={() => void stopActiveRecording(true)}
          >
            {recordingLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                ■ Stop Recording
              </Text>
            )}
          </TouchableOpacity>
        )}

        {isRecording ? (
          <Text style={styles.recordingStatus}>
            ● Recording in progress — {formatTime(recordingSeconds)}
          </Text>
        ) : (
          <Text style={styles.idleStatus}>
            {videoReady
              ? 'Camera ready. Tap Start Recording.'
              : 'Waiting for camera stream...'}
          </Text>
        )}
      </View>

      <PTZControls deviceId={deviceId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  content: {
    paddingBottom: 24,
  },

  video: {
    height: 280,
    backgroundColor: '#111827',
    overflow: 'hidden',
  },

  player: {
    width: '100%',
    height: '100%',
  },

  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },

  live: {
    color: '#EF4444',
    fontWeight: '900',
  },

  recordingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },

  recordingBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  recordingControls: {
    backgroundColor: '#111827',
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  recordButton: {
    backgroundColor: '#DC2626',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },

  stopButton: {
    backgroundColor: '#374151',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  recordingStatus: {
    color: '#F87171',
    fontWeight: '700',
    marginTop: 12,
  },

  idleStatus: {
    color: '#94A3B8',
    marginTop: 12,
    textAlign: 'center',
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  cameraText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },

  streamText: {
    color: '#94A3B8',
    marginTop: 10,
    textAlign: 'center',
  },

  error: {
    color: '#FCA5A5',
    textAlign: 'center',
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
  },
});
