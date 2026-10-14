
import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import Ionicons from "@react-native-vector-icons/ionicons";

import DashboardScreen from
  "../screens/dashboard/DashboardScreen";

import DevicesScreen from
  "../screens/devices/DevicesScreen";

import AddDeviceScreen from
  "../screens/devices/AddDeviceScreen";

import DeviceDetailsScreen from
  "../screens/devices/DeviceDetailsScreen";

import LiveCameraScreen from
  "../screens/camera/LiveCameraScreen";

import AlertsScreen from
  "../screens/alerts/AlertsScreen";

import RecordingsScreen from
  "../screens/recordings/RecordingsScreen";

import ProfileScreen from
  "../screens/profile/ProfileScreen";

// Navigation Types
type TabParamList = {
  Dashboard: undefined;
  DeviceStack: undefined;
  Alerts: undefined;
  Recordings: undefined;
  Profile: undefined;
};

type DeviceStackParamList = {
  Devices: undefined;
  AddDevice: undefined;
  DeviceDetails: undefined;
  LiveCamera: undefined;
};

// Create Navigators
const Tab = createBottomTabNavigator<TabParamList>();

const Stack =
  createNativeStackNavigator<DeviceStackParamList>();

// Ionicons TypeScript Type
type IconName =
  React.ComponentProps<typeof Ionicons>["name"];

// Device Stack Navigator
function DeviceStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerTintColor: "#2563EB",
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Stack.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          title: "My Devices",
        }}
      />

      <Stack.Screen
        name="AddDevice"
        component={AddDeviceScreen}
        options={{
          title: "Add Device",
        }}
      />

      <Stack.Screen
        name="DeviceDetails"
        component={DeviceDetailsScreen}
        options={{
          title: "Device Details",
        }}
      />

      <Stack.Screen
        name="LiveCamera"
        component={LiveCameraScreen}
        options={{
          title: "Live Camera",
        }}
      />
    </Stack.Navigator>
  );
}

// Main Bottom Tab Navigator
export default function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({
          focused,
          color,
          size,
        }) => {
          // Fix for Ionicons TypeScript Error
          let iconName: IconName;

          switch (route.name) {
            case "Dashboard":
              iconName = focused
                ? "home"
                : "home-outline";
              break;

            case "DeviceStack":
              iconName = focused
                ? "hardware-chip"
                : "hardware-chip-outline";
              break;

            case "Alerts":
              iconName = focused
                ? "notifications"
                : "notifications-outline";
              break;

            case "Recordings":
              iconName = focused
                ? "videocam"
                : "videocam-outline";
              break;

            case "Profile":
              iconName = focused
                ? "person-circle"
                : "person-circle-outline";
              break;

            default:
              iconName = "ellipse-outline";
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        // Active Tab Color
        tabBarActiveTintColor: "#2563EB",

        // Inactive Tab Color
        tabBarInactiveTintColor: "#94A3B8",

        // Bottom Tab Styling
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E2E8F0",
          borderTopWidth: 1,
        },

        // Tab Label Styling
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        // Header Styling
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },

        headerTitleStyle: {
          fontWeight: "700",
        },

        headerTintColor: "#2563EB",
      })}
    >
      {/* Dashboard Tab */}
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Home",
        }}
      />

      {/* Devices Tab */}
      <Tab.Screen
        name="DeviceStack"
        component={DeviceStack}
        options={{
          title: "Devices",
          headerShown: false,
        }}
      />

      {/* Alerts Tab */}
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: "Alerts",
        }}
      />

      {/* Recordings Tab */}
      <Tab.Screen
        name="Recordings"
        component={RecordingsScreen}
        options={{
          title: "Recordings",
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}
