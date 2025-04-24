import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ListScreen from './app/screens/ListScreen';

export default function App() {
  return (
    // <View style={styles.container}>
    <>
    {/* <SafeAreaView> */}
      <ListScreen />
      <StatusBar style="auto" />
    {/* </SafeAreaView> */}
    </>
    // </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
