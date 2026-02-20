import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Alert, 
  ScrollView, Animated, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../api/Constants';
const MenuScreen = ({ navigation, route }: any) => {
  // קבלת שם המשתמש מהתחברות
  const { userName } = route.params || { userName: 'אורח' };
  const MY_IP = '192.168.1.XXX'; // <--- שנה ל-IP שלך!

  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // 1. פונקציה למשיכת הזמנות מהשרת
  const fetchInvitations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/invitations/${userName}`);
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
        if (data.length > 0) startBlinking();
      }
    } catch (error) {
      console.error("Fetch Invites Error:", error);
    }
  };

  // 2. אנימציית הבהוב
  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    fetchInvitations();
    const interval = setInterval(fetchInvitations, 15000); // בדיקה כל 15 שניות
    return () => clearInterval(interval);
  }, []);

  // 3. אישור הזמנה
  const handleAcceptInvite = async (inviteId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
        method: 'POST'
      });
      if (response.ok) {
        Alert.alert("הצלחה!", "הצטרפת לקבוצה בהצלחה.");
        fetchInvitations();
      } else {
        Alert.alert("שגיאה", "לא ניתן היה לאשר את ההזמנה.");
      }
    } catch (error) {
      Alert.alert("שגיאה", "בעיית תקשורת עם השרת.");
    } finally {
      setLoading(false);
    }
  };

  const showInviteAlert = () => {
    if (invitations.length === 0) {
      Alert.alert("הזמנות", "אין לך הזמנות חדשות.");
      return;
    }
    const invite = invitations[0];
    Alert.alert(
      "הזמנה חדשה 📩",
      `הוזמנת לקבוצת "${invite.groupName}"`,
      [
        { text: "אשר הצטרפות ✅", onPress: () => handleAcceptInvite(invite.id) },
        { text: "סגור", style: "cancel" }
      ]
    );
  };

  const handleCreatePostChoice = () => {
    Alert.alert("לאן להעלות?", "בחר יעד:", [
      { text: "🌐 עולם (ציבורי)", onPress: () => navigation.navigate('CreatePost', { target: 'world' }) },
      { text: "👥 קבוצה", onPress: () => navigation.navigate('CreatePost', { target: 'group' }) },
      { text: "ביטול", style: "cancel" }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>שלום {userName} 👋</Text>

        {/* --- כפתור הזמנות מהבהב --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>התראות</Text>
          <Animated.View style={{ opacity: invitations.length > 0 ? blinkAnim : 1 }}>
            <TouchableOpacity 
              style={[styles.inviteButton, invitations.length > 0 && styles.activeInvite]} 
              onPress={showInviteAlert}
            >
              {loading ? (
                <ActivityIndicator color="#6200EE" />
              ) : (
                <Text style={styles.buttonText}>
                  {invitations.length > 0 ? `🔔 יש לך (${invitations.length}) הזמנות ממתינות!` : "📩 אין הזמנות חדשות"}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* --- ניהול קבוצות --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>הקבוצות שלי</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('MyGroups')}>
            <Text style={styles.buttonText}>👥 רשימת הקבוצות שלי</Text>
          </TouchableOpacity>
          
          {/* <TouchableOpacity style={[styles.menuButton, { backgroundColor: '#E1D5F5' }]} onPress={() => navigation.navigate('CreateGroup')}>
            <Text style={styles.buttonText}>➕ יצירת קבוצה חדשה</Text>
          </TouchableOpacity> */}
          <TouchableOpacity 
  style={[styles.menuButton, { backgroundColor: '#E1D5F5' }]} 
  onPress={() => navigation.navigate('CreateGroup', { userName: userName })} // העברת השם
>
  <Text style={styles.buttonText}>➕ יצירת קבוצה חדשה</Text>
</TouchableOpacity>
        </View>

        {/* --- פוסטים --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>פוסטים</Text>
          <TouchableOpacity style={[styles.menuButton, styles.postButton]} onPress={handleCreatePostChoice}>
            <Text style={styles.buttonText}>✍️ העלאת פוסט חדש</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('GlobalFeed')}>
            <Text style={styles.buttonText}>🌐 פיד ציבורי</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>התנתק</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6200EE', marginBottom: 25 },
  section: { width: '100%', marginBottom: 20 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 8, textAlign: 'right' },
  menuButton: { 
    backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 10, 
    flexDirection: 'row-reverse', alignItems: 'center', elevation: 2 
  },
  inviteButton: {
    backgroundColor: '#FFF', padding: 18, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD',
    alignItems: 'center'
  },
  activeInvite: { backgroundColor: '#FFF59D', borderColor: '#FBC02D', borderStyle: 'solid', borderWidth: 2 },
  postButton: { borderRightWidth: 5, borderRightColor: '#6200EE' },
  buttonText: { fontSize: 16, color: '#333', fontWeight: '600' },
  logoutButton: { marginTop: 30 },
  logoutText: { color: '#D32F2F', fontWeight: 'bold' }
});

export default MenuScreen;