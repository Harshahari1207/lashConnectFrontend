import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

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

const Tab =
  createBottomTabNavigator();

const Stack =
  createNativeStackNavigator();

function DeviceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Devices"
        component={DevicesScreen}
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
        component={
          DeviceDetailsScreen
        }
        options={{
          title: "Device",
        }}
      />

      <Stack.Screen
        name="LiveCamera"
        component={
          LiveCameraScreen
        }
        options={{
          title: "Live Camera",
        }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={
          DashboardScreen
        }
        options={{
          title: "Home",
        }}
      />

      <Tab.Screen
        name="DeviceStack"
        component={DeviceStack}
        options={{
          title: "Devices",
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
      />

      <Tab.Screen
        name="Recordings"
        component={
          RecordingsScreen
        }
      />

      <Tab.Screen
        name="Profile"
        component={
          ProfileScreen
        }
      />
    </Tab.Navigator>
  );
}