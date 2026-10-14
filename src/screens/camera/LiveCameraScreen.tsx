import React, { useEffect, useState } from 'react';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Video from 'react-native-video';

import { getCameraStream } from '../../api/deviceApi';
import PTZControls from './PTZControls';
import type { StreamInfo } from '../../types/device';

export default function LiveCameraScreen({ route }: any) {
  const { deviceId } = route.params;

  const [stream, setStream] = useState<StreamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadStream = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getCameraStream(deviceId);
        console.log(data);
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

    loadStream();

    return () => {
      mounted = false;
    };
  }, [deviceId]);

  const streamUrl = 'http://10.0.2.2:8888/camera1/index.m3u8';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />

        <Text style={styles.loadingText}>Connecting to camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
              controls={true}
              resizeMode="contain"
              paused={false}
              muted={true}
              onLoad={() => {
                console.log('Camera stream loaded successfully.');
              }}
              onError={videoError => {
                console.error(
                  'Video playback error:',
                  JSON.stringify(videoError, null, 2),
                );

                setError('Unable to play the simulated camera stream.');
              }}
            />

            <View style={styles.liveBadge}>
              <Text style={styles.live}>● LIVE</Text>
            </View>
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

      <PTZControls deviceId={deviceId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  cameraText: {
    color: '#fff',
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
    color: '#fff',
    marginTop: 12,
  },
});
