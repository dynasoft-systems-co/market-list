import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './app/screens/HomeScreen';
import ListScreen from './app/screens/ListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
        {/* <Stack.Navigator initialRouteName="ListScreen"> */}
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ title: 'My Lists', headerShown: false }}
          />
          <Stack.Screen
            name="ListScreen"
            component={ListScreen}
            options={{ title: 'List Items' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}





// import { StatusBar } from 'expo-status-bar';
// // import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// // import ListScreen from './app/screens/ListScreen';
// import HomeScreen from './app/screens/HomeScreen';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       {/* <ListScreen /> */}
//       <HomeScreen />
//       <StatusBar style="auto" />
//     </GestureHandlerRootView>
//   );
// }
