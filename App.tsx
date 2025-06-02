import "react-native-gesture-handler";

import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./app/screens/HomeScreen";
import ListScreen from "./app/screens/ListScreen";
import NewListScreen from "./app/screens/NewListScreen";
import GroupListScreen from "./app/screens/GroupListScreen";

export type RootStackParamList = {
  Home: undefined;
  List: { listId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={
            {
              // headerStyle: { backgroundColor: "#7216f4" },
              // headerTintColor: "#fff",
              // headerTitleStyle: { fontWeight: "bold" },
            }
          }
          initialRouteName="Home"
        >
          <Stack.Screen
            options={{
              title: "Market List",
              headerRight: () => (
                <TouchableOpacity onPress={() => console.log("Ação")}>
                  <MaterialIcons name="manage-accounts" size={24} color="#333" />
                </TouchableOpacity>
              ),
            }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={() => console.log("Ação")}>
                  <MaterialIcons name="more-vert" size={24} color="#333" />
                </TouchableOpacity>
              ),
            }}
            name="List"
            component={ListScreen}
          />
          <Stack.Screen
            name="NewList"
            component={NewListScreen}
          />
          <Stack.Screen
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={() => console.log("Ação")}>
                  <MaterialIcons name="more-vert" size={24} color="#333" />
                </TouchableOpacity>
              ),
            }}
            name="GroupList"
            component={GroupListScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
};

export default App;
