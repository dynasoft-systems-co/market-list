import { StatusBar } from 'expo-status-bar';
// import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import ListScreen from './app/screens/ListScreen';
import ShoppingListManager from './app/screens/ShoppingListManager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <ListScreen /> */}
      <ShoppingListManager />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
