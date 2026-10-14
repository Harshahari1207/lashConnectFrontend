
import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
} from "../../api/profileApi";

import { theme } from "../../theme/theme";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");

  const resetForm = useCallback(
    (profile: {
      name: string;
      phone?: string;
      city?: string;
    }) => {
      setName(profile.name);
      setPhone(profile.phone ?? "");
      setCity(profile.city ?? "");
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadProfile = async () => {
        try {
          setLoading(true);

          const profile = await getMyProfile();

          if (!active) return;

          await updateUser(profile);

          resetForm(profile);
        } catch (error) {
          console.error("Load profile failed:", error);
        } finally {
          if (active) setLoading(false);
        }
      };

      void loadProfile();

      return () => {
        active = false;
      };
    }, [resetForm]),
  );

  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanCity = city.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      Alert.alert(
        "Invalid Name",
        "Name must contain between 2 and 100 characters.",
      );
      return;
    }

    if (
      cleanPhone !== "" &&
      !/^\+?[0-9 ()-]{7,20}$/.test(cleanPhone)
    ) {
      Alert.alert(
        "Invalid Phone",
        "Enter a valid phone number.",
      );
      return;
    }

    if (cleanCity.length > 100) {
      Alert.alert(
        "Invalid City",
        "City must be at most 100 characters.",
      );
      return;
    }

    try {
      setSaving(true);

      const updatedProfile = await updateMyProfile({
        name: cleanName,
        phone: cleanPhone,
        city: cleanCity,
      });

      await updateUser(updatedProfile);
      resetForm(updatedProfile);
      setEditing(false);

      Alert.alert(
        "Success",
        "Your profile has been updated.",
      );
    } catch (error) {
      console.error("Profile update failed:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          "Unable to update profile."
        : "Unable to update profile.";

      Alert.alert("Update Failed", message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      resetForm(user);
    }

    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => void logout(),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>

        <Text style={styles.profileName}>
          {user?.name || "User"}
        </Text>

        <Text style={styles.profileEmail}>
          {user?.email || ""}
        </Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role?.toUpperCase() || "VIEWER"}
          </Text>
        </View>

        {loading && (
          <ActivityIndicator
            color="#2563EB"
            style={styles.loading}
          />
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[
            styles.input,
            !editing && styles.readOnlyInput,
          ]}
          value={name}
          onChangeText={setName}
          editable={editing && !saving}
          placeholder="Enter full name"
          placeholderTextColor="#94A3B8"
          maxLength={100}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={user?.email ?? ""}
          editable={false}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[
            styles.input,
            !editing && styles.readOnlyInput,
          ]}
          value={phone}
          onChangeText={setPhone}
          editable={editing && !saving}
          placeholder="Add phone number"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          maxLength={20}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={[
            styles.input,
            !editing && styles.readOnlyInput,
          ]}
          value={city}
          onChangeText={setCity}
          editable={editing && !saving}
          placeholder="Add your city"
          placeholderTextColor="#94A3B8"
          maxLength={100}
        />

        <Text style={styles.label}>Account Role</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={user?.role ?? ""}
          editable={false}
        />

        {!editing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              ✎ Edit Profile
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => void handleSave()}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
        disabled={saving}
      >
        <Text style={styles.logoutText}>
          LOGOUT
        </Text>
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

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    alignItems: "center",
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    color: "#2563EB",
    fontSize: 32,
    fontWeight: "800",
  },

  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  profileEmail: {
    color: "#64748B",
    marginTop: 5,
  },

  roleBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 12,
  },

  roleText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 12,
  },

  loading: {
    marginTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
    marginVertical: 22,
  },

  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  label: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#111827",
    marginBottom: 16,
  },

  readOnlyInput: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },

  editButton: {
    backgroundColor: "#2563EB",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },

  actions: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelText: {
    color: "#475569",
    fontWeight: "700",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  logout: {
    marginTop: 24,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.danger,
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: theme.colors.danger,
    fontWeight: "800",
  },
});
