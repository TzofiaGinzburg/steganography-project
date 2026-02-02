import React from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuScreen = ({ navigation, route }: { navigation: any, route: any }) => {
  // קבלת הפרמטרים שנשלחו בניווט
  const { userName } = route.params || { userName: 'אורח' };

  // פונקציית הבחירה להעלאת פוסט
  const handleCreatePostChoice = () => {
    Alert.alert(
      "לאן להעלות את הפוסט?",
      "בחר את יעד הפרסום:",
      [
        {
          text: "🌐 עולם (ציבורי)",
          onPress: () => navigation.navigate('CreatePost', { target: 'world' })
        },
        {
          text: "👥 קבוצה ספציפית",
          onPress: () => navigation.navigate('CreatePost', { target: 'group' })
        },
        { text: "ביטול", style: "cancel" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* כאן השתמשנו בשם המשתמש שהגיע מה-Login */}
        <Text style={styles.title}>שלום {userName}, ברוך הבא!</Text>

        {/* אזור אישי וניהול קבוצות */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>הקבוצות שלי</Text>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => navigation.navigate('MyGroups')}
          >
            <Text style={styles.buttonText}>👥 רשימת הקבוצות שלי</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => navigation.navigate('GroupGallery')}
          >
            <TouchableOpacity 
  style={[styles.menuButton, { backgroundColor: '#E1D5F5' }]} 
  onPress={() => navigation.navigate('CreateGroup')}
>
  <Text style={styles.buttonText}>➕ יצירת קבוצה חדשה</Text>
</TouchableOpacity>
            <Text style={styles.buttonText}>🖼️ צפייה בתמונות הקבוצה</Text>
          </TouchableOpacity>
        </View>

        {/* אזור חברתי ופוסטים */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>קהילה ופוסטים</Text>
          
          <TouchableOpacity 
            style={[styles.menuButton, styles.postButton]} 
            onPress={handleCreatePostChoice}
          >
            <Text style={styles.buttonText}>✍️ העלאת פוסט חדש</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => navigation.navigate('GlobalFeed', { target: 'world' })}
          >
            <Text style={styles.buttonText}>🌐 צפייה בפוסטים בעולם</Text>
          </TouchableOpacity>
        </View>

        {/* התנתקות */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.logoutText}>התנתק מהמערכת</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#6200EE', marginBottom: 30, textAlign: 'center' },
  section: { width: '100%', marginBottom: 25 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'right' },
  menuButton: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 10, 
    flexDirection: 'row-reverse', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  postButton: { borderRightWidth: 5, borderRightColor: '#6200EE' },
  buttonText: { fontSize: 16, color: '#444', fontWeight: '600' },
  logoutButton: { marginTop: 20, padding: 10 },
  logoutText: { color: 'red', fontSize: 16, fontWeight: 'bold' }
});

export default MenuScreen;