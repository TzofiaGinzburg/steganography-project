import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  console.log("מנסה להתחבר עם:", username); // בדיקה שהפונקציה רצה
  setLoading(true);
  
  try {
    const response = await fetch('http://10.0.2.2:8080/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log("סטטוס תשובה מהשרת:", response.status); // האם חזר 200?

    if (response.ok) {
      const data = await response.json();
      console.log("נתוני משתמש שהתקבלו:", data);
      navigation.navigate('Menu'); // כאן מתבצע המעבר
    } else {
      const errorText = await response.text();
      console.log("שגיאת התחברות:", errorText);
      Alert.alert("שגיאה", "שם משתמש או סיסמה שגויים");
    }
  } catch (error) {
    console.error("שגיאת רשת:", error);
    Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. בדוק שהשרת פועל.");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התחברות</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="שם משתמש / מייל" 
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="סיסמה" 
        secureTextEntry 
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>התחברות</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>אין לך חשבון? להרשמה לחץ כאן</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#6200EE', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#F0F0F0', padding: 15, borderRadius: 10, marginBottom: 15, textAlign: 'right' },
  button: { backgroundColor: '#6200EE', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#6200EE', textAlign: 'center', marginTop: 20, fontSize: 16 }
});

export default LoginScreen;