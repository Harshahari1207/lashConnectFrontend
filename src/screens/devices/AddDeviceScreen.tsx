import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {pairDevice} from '../../api/deviceApi';
import {theme} from '../../theme/theme';

export default function AddDeviceScreen() {
  const navigation = useNavigation();

  const [deviceId, setDeviceId] = useState('');
  const [pairingToken, setPairingToken] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePairDevice = async () => {
    if (!deviceId.trim() || !pairingToken.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter both the Device ID and Pairing Token.',
      );
      return;
    }

    try {
      setLoading(true);

      await pairDevice(deviceId.trim(), pairingToken.trim(), {
        name: name.trim() || undefined,
      });

      Alert.alert('Success', 'Your device has been paired successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Unable to pair the device. Check the ID and token, then try again.';

      Alert.alert('Pairing Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Add Device</Text>
        <Text style={styles.subtitle}>
          Connect your IP camera to Lash Connect.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Enter the device ID and the secure pairing token provided by your
          device or administrator.
        </Text>
      </View>

      <Text style={styles.label}>Device ID *</Text>
      <TextInput
        style={styles.input}
        value={deviceId}
        onChangeText={setDeviceId}
        placeholder="e.g. cam_10025"
        placeholderTextColor={theme.colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Pairing Token *</Text>
      <TextInput
        style={styles.input}
        value={pairingToken}
        onChangeText={setPairingToken}
        placeholder="Enter pairing token"
        placeholderTextColor={theme.colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />

      <Text style={styles.helperText}>
        Your pairing token is used to authorize device registration.
      </Text>

      <Text style={styles.label}>Device Name (optional)</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Front Door Camera"
        placeholderTextColor={theme.colors.muted}
        autoCapitalize="words"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handlePairDevice}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Pair Device</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.muted,
    marginTop: 6,
  },
  infoBox: {
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 22,
  },
  infoText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  label: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: theme.colors.text,
  },
  helperText: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});