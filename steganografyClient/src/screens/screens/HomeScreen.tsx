import React from 'react';
import { Theme } from '../styles/theme'; // הנתיב מהמסך אל תיקיית העיצוב

// שימוש בקוד:
// style={{ color: Theme.colors.primary }}
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // וודא שהתקנת react-native-vector-icons

const HomeScreen = ({ navigation }: any) => {
  
  // פונקציה לקבלת ברכה לפי שעה
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* אזור הלוגו */}
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
           <MaterialCommunityIcons name="image-filter-center-focus" size={80} color="#6200EE" />
        </View>
        <Text style={styles.appName}>StegaShare</Text>
        <Text style={styles.tagline}>הסתרת מידע בשיתוף תמונות</Text>
      </View>

      {/* הודעת ברכה */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greetingText}>{getGreeting()}, אורח</Text>
        <Text style={styles.subText}>מוכן לשתף מסרים סודיים?</Text>
      </View>

      {/* כפתורי פעולה */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>התחברות</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>הרשמה למערכת</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 30 },
  logoContainer: { alignItems: 'center', marginTop: 80 },
  iconCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#6200EE', marginTop: 20 },
  tagline: { fontSize: 16, color: '#757575', letterSpacing: 1 },
  welcomeSection: { marginTop: 60, alignItems: 'center' },
  greetingText: { fontSize: 26, fontWeight: '600', color: '#212121' },
  subText: { fontSize: 16, color: '#9E9E9E', marginTop: 5 },
  buttonContainer: { marginTop: 'auto', marginBottom: 50 },
  loginButton: { backgroundColor: '#6200EE', paddingVertical: 15, borderRadius: 12, alignItems: 'center', elevation: 3 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  registerButton: { backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 15, borderWidth: 2, borderColor: '#6200EE' },
  registerButtonText: { color: '#6200EE', fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;