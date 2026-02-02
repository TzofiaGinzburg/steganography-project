import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../styles/theme';

// --- מסך ראשי (מופיע אחרי התחברות) ---
export const MainScreen = ({ navigation, route }: any) => {
  const { userName } = route.params || { userName: "אורח" };
  const [invitations, setInvitations] = useState<any[]>([]);
  const MY_IP = "192.168.1.112";

  useEffect(() => {
    const checkInvites = async () => {
      try {
        const res = await fetch(`http://${MY_IP}:8080/api/groups/invitations/${userName}`);
        const data = await res.json();
        setInvitations(data);
      } catch (e) {
        console.log("Error fetching invites:", e);
      }
    };
    checkInvites();
  }, [userName]);

  const acceptInvite = async (inviteId: string) => {
    try {
      await fetch(`http://${MY_IP}:8080/api/groups/invitations/accept?invitationId=${inviteId}`, { method: 'POST' });
      setInvitations([]); 
      Alert.alert("מעולה!", "נוספת לקבוצה בהצלחה");
    } catch (e) {
      Alert.alert("שגיאה", "לא הצלחנו לאשר את ההזמנה");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greetingText}>שלום, {userName} 👋</Text>
      
      {invitations.length > 0 && (
        <View style={styles.inviteBox}>
          <Text style={styles.inviteText}>הוזמנת לקבוצת: **{invitations[0].groupName}**</Text>
          <TouchableOpacity style={styles.acceptBtn} onPress={() => acceptInvite(invitations[0].id)}>
            <Text style={styles.whiteText}>אשר הצטרפות ✅</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.mainBtn} 
        onPress={() => navigation.navigate('MyGroups', { userName })}
      >
        <Text style={styles.loginButtonText}>הקבוצות שלי 👥</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- מסך בית (לוגין/הרשמה) ---
const HomeScreen = ({ navigation }: any) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
           <MaterialCommunityIcons name="image-filter-center-focus" size={80} color={Colors.primary || "#6200EE"} />
        </View>
        <Text style={styles.appName}>StegaShare</Text>
        <Text style={styles.tagline}>הסתרת מידע בשיתוף תמונות</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.greetingText}>{getGreeting()}, אורח</Text>
        <Text style={styles.subText}>מוכן לשתף מסרים סודיים?</Text>
      </View>

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

// --- עיצוב מאוחד ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 30 },
  logoContainer: { alignItems: 'center', marginTop: 50 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#6200EE', marginTop: 20 },
  tagline: { fontSize: 16, color: '#757575', letterSpacing: 1 },
  welcomeSection: { marginTop: 40, alignItems: 'center' },
  greetingText: { fontSize: 24, fontWeight: '600', color: '#212121', textAlign: 'center' },
  subText: { fontSize: 16, color: '#9E9E9E', marginTop: 5 },
  buttonContainer: { marginTop: 'auto', marginBottom: 40 },
  loginButton: { backgroundColor: '#6200EE', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  registerButton: { backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 15, borderWidth: 2, borderColor: '#6200EE' },
  registerButtonText: { color: '#6200EE', fontSize: 18, fontWeight: 'bold' },
  // סגנונות להזמנות
  inviteBox: { backgroundColor: '#E8EAF6', padding: 20, borderRadius: 15, marginTop: 20, alignItems: 'center', borderRightWidth: 5, borderRightColor: '#6200EE' },
  inviteText: { fontSize: 18, marginBottom: 10 },
  acceptBtn: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8 },
  whiteText: { color: '#fff', fontWeight: 'bold' },
  mainBtn: { backgroundColor: '#6200EE', padding: 18, borderRadius: 12, marginTop: 30, alignItems: 'center' }
});

export default HomeScreen;