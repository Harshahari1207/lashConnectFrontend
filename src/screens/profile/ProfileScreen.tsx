import React from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  theme,
} from "../../theme/theme";

export default function ProfileScreen() {
  const {
    user,
    logout,
  } = useAuth();

  const handleLogout =
    () => {
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
            onPress: logout,
          },
        ]
      );
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Profile
      </Text>

      <View style={styles.card}>
        <Text style={styles.name}>
          {user?.name}
        </Text>

        <Text style={styles.email}>
          {user?.email}
        </Text>

        <Text style={styles.role}>
          Role: {user?.role}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          LOGOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor:
        theme.colors.background,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 20,
    },

    card: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 14,
      elevation: 2,
    },

    name: {
      fontSize: 22,
      fontWeight: "800",
    },

    email: {
      marginTop: 6,
      color:
        theme.colors.textSecondary,
    },

    role: {
      marginTop: 15,
      fontWeight: "600",
    },

    logout: {
      marginTop: 30,
      height: 52,
      borderRadius: 10,
      borderWidth: 1,
      borderColor:
        theme.colors.danger,
      justifyContent: "center",
      alignItems: "center",
    },

    logoutText: {
      color:
        theme.colors.danger,
      fontWeight: "800",
    },
  });