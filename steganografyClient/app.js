// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>האפליקציה רצה 🎉</Text>
//       <Text>React Native + Android Emulator</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//   },
//   text: {
//     fontSize: 22,
//     marginBottom: 10,
//   },
// });
// App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Button } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('');

  const callServer = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/hello');
      const text = await response.text();
      setMessage(text);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };
const sendNameToServer = async () => {
  try {
    const response = await fetch('http://10.0.2.2:8080/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'צצ' })
    });
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error(error);
  }
};
<Button title="שלח לשרת" onPress={sendNameToServer} />

  useEffect(() => {
    callServer();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{message}</Text>
      <Button title="קרא שוב מהשרת" onPress={callServer} />
    </SafeAreaView>
  );
}
