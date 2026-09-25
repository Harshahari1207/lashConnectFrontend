import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  useAuth,
} from "../context/AuthContext";

import AuthNavigator from
  "./AuthNavigator";

import MainNavigator from
  "./MainNavigator";

import Loading from
  "../components/Loading";

export default function AppNavigator() {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}